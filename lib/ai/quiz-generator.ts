import { generateTextWithGemini } from "./gemini-client"

export async function generateQuiz({
  subject,
  grade,
  difficulty,
  numQuestions,
  learningStyle,
}: {
  subject: string
  grade: string
  difficulty: "beginner" | "intermediate" | "advanced"
  numQuestions: number
  learningStyle?: string
}) {
  const difficultyDescriptions = {
    beginner: "basic concepts, fundamental principles, simple recall questions",
    intermediate: "moderate complexity, application of concepts, some analysis required",
    advanced: "complex scenarios, critical thinking, synthesis of multiple concepts",
  }

  const prompt = `Generate exactly ${numQuestions} multiple-choice questions for ${subject} at ${grade} level.
Difficulty: ${difficulty} (${difficultyDescriptions[difficulty]})
${learningStyle ? `Learning style preference: ${learningStyle}` : ""}

Format each question as JSON with this exact structure:
{
  "id": number,
  "question": "Question text",
  "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
  "correctAnswer": "A",
  "explanation": "Brief explanation of why this is correct"
}

Return a JSON array with all ${numQuestions} questions. Start with [ and end with ]. Do not include any markdown formatting or code blocks.`

  try {
    console.log("[v0] Generating quiz with Gemini API for subject:", subject)
    const text = await generateTextWithGemini({ prompt, temperature: 0.7, maxTokens: 4000 })

    // Parse the JSON response
    const questions = JSON.parse(text)
    console.log("[v0] Successfully generated", questions.length, "quiz questions")
    return questions
  } catch (error) {
    console.error("Error generating quiz:", error)
    throw new Error("Failed to generate quiz questions")
  }
}

export async function generateFlashcards({
  subject,
  grade,
  difficulty,
  numCards,
  learningStyle,
}: {
  subject: string
  grade: string
  difficulty: "beginner" | "intermediate" | "advanced"
  numCards: number
  learningStyle?: string
}) {
  const difficultyDescriptions = {
    beginner: "simple definitions, basic facts, fundamental terms",
    intermediate: "concepts with examples, relationships between ideas",
    advanced: "complex topics, cross-disciplinary connections, advanced applications",
  }

  const prompt = `Generate exactly ${numCards} flashcard pairs for ${subject} at ${grade} level.
Difficulty: ${difficulty} (${difficultyDescriptions[difficulty]})
${learningStyle ? `Learning style preference: ${learningStyle}` : ""}

Format each flashcard as JSON with this exact structure:
{
  "id": number,
  "front": "Question or term",
  "back": "Answer or definition"
}

Return a JSON array with all ${numCards} flashcards. Start with [ and end with ]. Do not include any markdown formatting or code blocks.`

  try {
    console.log("[v0] Generating flashcards with Gemini API for subject:", subject)
    const text = await generateTextWithGemini({ prompt, temperature: 0.7, maxTokens: 3000 })

    const flashcards = JSON.parse(text)
    console.log("[v0] Successfully generated", flashcards.length, "flashcards")
    return flashcards
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error("Failed to generate flashcards")
  }
}
