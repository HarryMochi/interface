"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { createClient } from "@/lib/supabase/client"

interface GeneratedCard {
  id: number
  front: string
  back: string
}

export default function AIGenerateFlashcardsPage() {
  const [step, setStep] = useState<"setup" | "difficulty" | "generating" | "preview">("setup")
  const [topic, setTopic] = useState("")
  const [numberOfCards, setNumberOfCards] = useState(10)
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([])
  const [userGrade, setUserGrade] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("grade")
            .eq("id", userData.user.id)
            .single()
          if (profile) {
            setUserGrade(profile.grade)
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }
    fetchUserProfile()
  }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setStep("generating")
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic,
          grade: userGrade,
          difficulty,
          numCards: numberOfCards,
          learningStyle: "mixed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate flashcards")
      }

      const data = await response.json()
      setGeneratedCards(data.flashcards)
      setStep("preview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate flashcards")
      setStep("difficulty")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user && generatedCards.length > 0) {
        // Save flashcard set metadata
        const { data: setData } = await supabase
          .from("flashcard_sets")
          .insert([
            {
              user_id: userData.user.id,
              name: topic,
              difficulty,
              card_count: generatedCards.length,
            },
          ])
          .select()

        if (setData && setData[0]) {
          // Save individual cards
          const cardsToSave = generatedCards.map((card) => ({
            set_id: setData[0].id,
            front: card.front,
            back: card.back,
          }))

          await supabase.from("flashcards").insert(cardsToSave)

          // Save result tracking
          await supabase.from("flashcard_results").insert([
            {
              user_id: userData.user.id,
              subject: topic,
              difficulty,
              num_cards: generatedCards.length,
              cards_mastered: 0,
              completed: false,
            },
          ])
        }
      }

      setStep("preview")
      setTimeout(() => {
        window.location.href = "/protected/flashcards"
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save flashcards")
    }
  }

  // ===== Setup Step =====
  if (step === "setup") {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/protected/flashcards"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <span className="rotate-180">
              <BitmapChevron />
            </span>
            Back to Flashcards
          </Link>

          <div className="border border-border p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className="text-accent">◈</span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">AI Powered</p>
            </div>
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Generate Flashcards</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              Enter a topic and let AI create flashcards for you automatically.
            </p>
          </div>

          {/* Topic Input */}
          <div className="border border-border p-6">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Topic or Subject
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, French Revolution, Python Basics"
              className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
          )}

          <button
            onClick={() => {
              if (!topic.trim()) {
                setError("Please enter a topic")
                return
              }
              setError(null)
              setStep("difficulty")
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
          >
            Continue
            <BitmapChevron />
          </button>
        </div>
      </div>
    )
  }

  // ===== Difficulty Step =====
  if (step === "difficulty") {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-border p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Customization</p>
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Flashcard Settings</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">Choose difficulty level and number of cards</p>
          </div>

          <div className="border border-border p-6 md:p-8">
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Difficulty Level</h3>
            <div className="grid grid-cols-3 gap-4">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as "beginner" | "intermediate" | "advanced")}
                  className={`p-4 border text-left transition-all duration-200 ${
                    difficulty === level
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest mb-1">{level}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {level === "beginner" && "Simple definitions"}
                    {level === "intermediate" && "With examples"}
                    {level === "advanced" && "Complex topics"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border p-6 md:p-8">
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Number of Cards</h3>
            <div className="flex gap-3 mb-4">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumberOfCards(num)}
                  className={`px-4 py-2 border font-mono text-sm transition-all duration-200 ${
                    numberOfCards === num
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={numberOfCards}
              onChange={(e) => setNumberOfCards(Math.max(1, Math.min(50, Number.parseInt(e.target.value) || 1)))}
              className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep("setup")
                setError(null)
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                  Generating...
                </>
              ) : (
                <>
                  Generate Flashcards
                  <BitmapChevron />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== Preview Step =====
  if (step === "preview") {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-border p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Generated</p>
            </div>
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Flashcards Ready</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              {generatedCards.length} flashcards created for "{topic}"
            </p>
          </div>

          {/* Cards Preview */}
          <div className="border border-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[var(--font-bebas)] text-xl tracking-wide">Preview</h3>
              <span className="font-mono text-xs text-muted-foreground">{generatedCards.length} cards</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedCards.map((card) => (
                <div key={card.id} className="border border-foreground/10 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        Front
                      </p>
                      <p className="font-mono text-sm">{card.front}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Back</p>
                      <p className="font-mono text-sm text-foreground/80">{card.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep("difficulty")
                setError(null)
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
            >
              Regenerate
            </button>
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
            >
              Save Flashcards
              <BitmapChevron />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
