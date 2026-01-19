import { generateQuiz } from "@/lib/ai/quiz-generator"
import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getRateLimitStatus } from "@/lib/ai/rate-limiter"
import { getCachedContent, setCachedContent } from "@/lib/ai/cache"
import { validateQuizResponse, sanitizeQuiz } from "@/lib/ai/validation"
import { recordMetric } from "@/lib/ai/metrics"
import { retryWithBackoff } from "@/lib/ai/retry"
import { checkUsageLimit, incrementUsage } from "@/lib/usage-limits"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { subject, grade, difficulty, numQuestions, learningStyle } = body

    if (!subject || !grade || !difficulty || !numQuestions) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check usage limits for free users
    const usageStatus = await checkUsageLimit(user.id, "quiz")
    if (!usageStatus.allowed) {
      return NextResponse.json(
        {
          error: "Quiz limit reached",
          code: "LIMIT_REACHED",
          used: usageStatus.used,
          limit: usageStatus.limit,
          planType: usageStatus.planType,
          message: `You've used all ${usageStatus.limit} quizzes for this month. Upgrade to Premium for more quizzes!`,
        },
        { status: 403 },
      )
    }

    if (!checkRateLimit(user.id)) {
      const status = getRateLimitStatus(user.id)
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          remaining: status.remaining,
          resetTime: status.resetTime,
        },
        { status: 429 },
      )
    }

    const cacheKey = {
      type: "quiz" as const,
      subject,
      grade,
      difficulty,
      count: Number.parseInt(numQuestions),
    }

    const cached = getCachedContent(cacheKey)
    if (cached && validateQuizResponse(cached)) {
      recordMetric({
        userId: user.id,
        type: "quiz",
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        status: "success",
        subject,
        difficulty,
        count: Number.parseInt(numQuestions),
      })
      return NextResponse.json({ questions: cached })
    }

    const questions = await retryWithBackoff(() =>
      generateQuiz({
        subject,
        grade,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        numQuestions: Number.parseInt(numQuestions),
        learningStyle,
      }),
    )

    if (!validateQuizResponse(questions)) {
      throw new Error("Invalid quiz response format")
    }

    const sanitized = sanitizeQuiz(questions)
    setCachedContent(cacheKey, sanitized)

    // Increment usage count after successful generation
    await incrementUsage(user.id, "quiz")

    // Get updated usage status
    const updatedStatus = await checkUsageLimit(user.id, "quiz")

    recordMetric({
      userId: user.id,
      type: "quiz",
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      status: "success",
      subject,
      difficulty,
      count: Number.parseInt(numQuestions),
    })

    return NextResponse.json({ 
      questions: sanitized,
      usage: {
        used: updatedStatus.used,
        limit: updatedStatus.limit,
        remaining: updatedStatus.remaining,
        planType: updatedStatus.planType,
      }
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("Quiz generation error:", error)

    recordMetric({
      userId: "unknown",
      type: "quiz",
      timestamp: Date.now(),
      duration,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate quiz" },
      { status: 500 },
    )
  }
}
