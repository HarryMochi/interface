import { generateFlashcards } from "@/lib/ai/quiz-generator"
import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getRateLimitStatus } from "@/lib/ai/rate-limiter"
import { getCachedContent, setCachedContent } from "@/lib/ai/cache"
import { validateFlashcardResponse, sanitizeFlashcards } from "@/lib/ai/validation"
import { recordMetric } from "@/lib/ai/metrics"
import { retryWithBackoff } from "@/lib/ai/retry"
import { checkUsageLimit, incrementUsage } from "@/lib/usage-limits"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { subject, grade, difficulty, numCards, learningStyle } = body

    if (!subject || !grade || !difficulty || !numCards) {
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
    const usageStatus = await checkUsageLimit(user.id, "flashcard")
    if (!usageStatus.allowed) {
      return NextResponse.json(
        {
          error: "Flashcard limit reached",
          code: "LIMIT_REACHED",
          used: usageStatus.used,
          limit: usageStatus.limit,
          planType: usageStatus.planType,
          message: `You've used all ${usageStatus.limit} flashcard sets for this month. Upgrade to Premium for more!`,
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
      type: "flashcard" as const,
      subject,
      grade,
      difficulty,
      count: Number.parseInt(numCards),
    }

    const cached = getCachedContent(cacheKey)
    if (cached && validateFlashcardResponse(cached)) {
      recordMetric({
        userId: user.id,
        type: "flashcard",
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        status: "success",
        subject,
        difficulty,
        count: Number.parseInt(numCards),
      })
      return NextResponse.json({ flashcards: cached })
    }

    const flashcards = await retryWithBackoff(() =>
      generateFlashcards({
        subject,
        grade,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        numCards: Number.parseInt(numCards),
        learningStyle,
      }),
    )

    if (!validateFlashcardResponse(flashcards)) {
      throw new Error("Invalid flashcard response format")
    }

    const sanitized = sanitizeFlashcards(flashcards)
    setCachedContent(cacheKey, sanitized)

    // Increment usage count after successful generation
    await incrementUsage(user.id, "flashcard")

    // Get updated usage status
    const updatedStatus = await checkUsageLimit(user.id, "flashcard")

    recordMetric({
      userId: user.id,
      type: "flashcard",
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      status: "success",
      subject,
      difficulty,
      count: Number.parseInt(numCards),
    })

    return NextResponse.json({ 
      flashcards: sanitized,
      usage: {
        used: updatedStatus.used,
        limit: updatedStatus.limit,
        remaining: updatedStatus.remaining,
        planType: updatedStatus.planType,
      }
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error("Flashcard generation error:", error)

    recordMetric({
      userId: "unknown",
      type: "flashcard",
      timestamp: Date.now(),
      duration,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate flashcards" },
      { status: 500 },
    )
  }
}
