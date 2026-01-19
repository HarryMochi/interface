import { generateTextWithGemini } from "./gemini-client"

export async function generateTutorResponse({
  question,
  grade,
  learningStyle,
}: {
  question: string
  grade: string
  learningStyle?: string
}) {
  const prompt = `You are an expert AI tutor helping a ${grade} student understand concepts.

Student's question: "${question}"
${learningStyle ? `Learning style: ${learningStyle}` : ""}

Provide a clear, concise explanation tailored to a ${grade} student's level.
- Start with a direct answer
- Use relevant examples
- Break down complex concepts
- Encourage critical thinking
- Keep the explanation engaging and appropriate for the student's level

Format your response in a way that's easy to understand and remember.`

  try {
    console.log("[v0] Generating tutor response with Gemini API for question:", question.substring(0, 50))
    const text = await generateTextWithGemini({ prompt, temperature: 0.8, maxTokens: 2000 })

    console.log("[v0] Successfully generated tutor response, length:", text.length)
    return text
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Error in generateTutorResponse:", {
      message: errorMessage,
      error: error,
    })
    throw new Error(`Failed to generate tutor response: ${errorMessage}`)
  }
}

export async function streamTutorResponse({
  question,
  grade,
  learningStyle,
}: {
  question: string
  grade: string
  learningStyle?: string
}) {
  return generateTutorResponse({ question, grade, learningStyle })
}
