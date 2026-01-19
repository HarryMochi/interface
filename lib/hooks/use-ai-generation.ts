"use client"

import { useState } from "react"

interface GenerationState {
  isLoading: boolean
  error: string | null
  data: unknown | null
}

export function useQuizGeneration() {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  })

  const generate = async (params: Record<string, unknown>) => {
    setState({ isLoading: true, error: null, data: null })

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate quiz")
      }

      const data = await response.json()
      setState({ isLoading: false, error: null, data: data.questions })
      return data.questions
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState({ isLoading: false, error: errorMessage, data: null })
      throw error
    }
  }

  return { ...state, generate }
}

export function useFlashcardGeneration() {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  })

  const generate = async (params: Record<string, unknown>) => {
    setState({ isLoading: true, error: null, data: null })

    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate flashcards")
      }

      const data = await response.json()
      setState({ isLoading: false, error: null, data: data.flashcards })
      return data.flashcards
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setState({ isLoading: false, error: errorMessage, data: null })
      throw error
    }
  }

  return { ...state, generate }
}
