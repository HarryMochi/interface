interface Quiz {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface Flashcard {
  id: number
  front: string
  back: string
}

export function validateQuizResponse(data: unknown): data is Quiz[] {
  if (!Array.isArray(data)) return false

  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "number" &&
      typeof item.question === "string" &&
      Array.isArray(item.options) &&
      item.options.every((opt: unknown) => typeof opt === "string") &&
      typeof item.correctAnswer === "string" &&
      typeof item.explanation === "string",
  )
}

export function validateFlashcardResponse(data: unknown): data is Flashcard[] {
  if (!Array.isArray(data)) return false

  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "number" &&
      typeof item.front === "string" &&
      typeof item.back === "string",
  )
}

export function sanitizeQuiz(quizzes: Quiz[]): Quiz[] {
  return quizzes.map((quiz) => ({
    ...quiz,
    question: quiz.question.substring(0, 1000),
    options: quiz.options.map((opt) => opt.substring(0, 500)),
    correctAnswer: quiz.correctAnswer.substring(0, 10),
    explanation: quiz.explanation.substring(0, 500),
  }))
}

export function sanitizeFlashcards(flashcards: Flashcard[]): Flashcard[] {
  return flashcards.map((card) => ({
    ...card,
    front: card.front.substring(0, 500),
    back: card.back.substring(0, 1000),
  }))
}
