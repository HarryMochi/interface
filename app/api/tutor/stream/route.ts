import { generateTutorResponse } from "@/lib/ai/tutor-generator"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { checkRateLimit, getRateLimitStatus } from "@/lib/ai/rate-limiter"
import { retryWithBackoff } from "@/lib/ai/retry"
import { recordMetric } from "@/lib/ai/metrics"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    if (!checkRateLimit(user.id)) {
      const status = getRateLimitStatus(user.id)
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          remaining: status.remaining,
          resetTime: status.resetTime,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("grade, learning_style")
      .eq("user_id", user.id)
      .single()

    if (profileError) {
      console.log("[v0] Profile not found, using defaults")
    }

    const grade = profile?.grade || "9-10"
    const learningStyle = profile?.learning_style || "visual"

    const { question } = await request.json()

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Invalid question" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Tutor API: Processing question for user", user.id)
    console.log("[v0] Tutor API: Grade:", grade, "Learning style:", learningStyle)

    const response = await retryWithBackoff(() =>
      generateTutorResponse({
        question: question.trim(),
        grade,
        learningStyle,
      }),
    )

    console.log("[v0] Tutor API: Successfully generated response")

    recordMetric({
      userId: user.id,
      type: "tutor",
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      status: "success",
    })

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error("[v0] Tutor API: DETAILED ERROR INFORMATION:")
    console.error("[v0] Error Type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0] Error Message:", errorMessage)
    console.error("[v0] Full Error:", error)
    if (error instanceof Error) {
      console.error("[v0] Stack Trace:", error.stack)
    }

    recordMetric({
      userId: "unknown",
      type: "tutor",
      timestamp: Date.now(),
      duration,
      status: "error",
      error: errorMessage,
    })

    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
