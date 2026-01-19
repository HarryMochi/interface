import { generateTextWithGemini } from "@/lib/ai/gemini-client"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Test Gemini: Starting test...")
    console.log("[v0] Test Gemini: GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY)

    const testPrompt = "Say hello and confirm you are working. Keep response short (1-2 sentences)."

    console.log("[v0] Test Gemini: Calling generateTextWithGemini...")

    const response = await generateTextWithGemini({
      prompt: testPrompt,
      temperature: 0.7,
      maxTokens: 100,
    })

    console.log("[v0] Test Gemini: Success! Response:", response)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Gemini API is working!",
        response,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    console.error("[v0] Test Gemini: ERROR")
    console.error("[v0] Test Gemini: Error Message:", errorMessage)
    console.error("[v0] Test Gemini: Full Error:", error)
    if (error instanceof Error) {
      console.error("[v0] Test Gemini: Stack:", error.stack)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        hasApiKey: !!process.env.GEMINI_API_KEY,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
