export async function generateTextWithGemini({
  prompt,
  temperature = 0.7,
  maxTokens = 2000,
}: {
  prompt: string
  temperature?: number
  maxTokens?: number
}) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("[v0] CRITICAL: GEMINI_API_KEY environment variable is not set!")
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.")
    }

    const apiKey = process.env.GEMINI_API_KEY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    console.log("[v0] Calling Gemini API directly (HTTP fetch) with prompt length:", prompt.length)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.95,
          topK: 40,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      const errorMessage = errorData?.error?.message || JSON.stringify(errorData)
      console.error("[v0] Gemini API HTTP Error:", response.status, errorMessage)
      throw new Error(`Gemini API error (${response.status}): ${errorMessage}`)
    }

    const data = await response.json()

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("[v0] Invalid Gemini response structure:", data)
      throw new Error("Invalid response from Gemini API - missing text content")
    }

    const text = data.candidates[0].content.parts[0].text
    console.log("[v0] Gemini API response received successfully, length:", text.length)

    return text
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Gemini API Error Details:", {
      message: errorMessage,
      hasApiKey: !!process.env.GEMINI_API_KEY,
      error: error,
    })
    throw error
  }
}
