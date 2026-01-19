"use client"

import { useState } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"

interface Flashcard {
  front: string
  back: string
}

export default function CreateFlashcardsPage() {
  const [setName, setSetName] = useState("")
  const [cards, setCards] = useState<Flashcard[]>([{ front: "", back: "" }])
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }])
  }

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index))
    }
  }

  const updateCard = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
  }

  const handleSave = async () => {
    if (!setName.trim() || cards.some((c) => !c.front.trim() || !c.back.trim())) return

    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      setSaved(true)
    }, 1000)
  }

  if (saved) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border p-8 text-center">
            <span className="text-4xl mb-4 block">✓</span>
            <h1 className="font-[var(--font-bebas)] text-3xl tracking-wide">Flashcard Set Created</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              Your flashcard set "{setName}" with {cards.length} cards has been saved.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/protected/flashcards"
                className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
              >
                Back to Flashcards
              </Link>
              <button
                onClick={() => {
                  setSaved(false)
                  setSetName("")
                  setCards([{ front: "", back: "" }])
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
              >
                Create Another
                <BitmapChevron />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Create</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">New Flashcard Set</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Create your own flashcards to help memorize key concepts.
          </p>
        </div>

        {/* Set Name */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Set Name
          </label>
          <input
            type="text"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="e.g., Biology Chapter 5"
            className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Card {index + 1}
                </span>
                {cards.length > 1 && (
                  <button
                    onClick={() => removeCard(index)}
                    className="font-mono text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2">Front (Question/Term)</label>
                  <textarea
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                    placeholder="Enter the question or term"
                    rows={3}
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-muted-foreground mb-2">Back (Answer/Definition)</label>
                  <textarea
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                    placeholder="Enter the answer or definition"
                    rows={3}
                    className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Card Button */}
        <button
          onClick={addCard}
          className="w-full p-4 border border-dashed border-foreground/20 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:border-accent hover:text-accent transition-all duration-200"
        >
          + Add Another Card
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!setName.trim() || cards.some((c) => !c.front.trim() || !c.back.trim()) || isSaving}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSaving ? "Saving..." : "Save Flashcard Set"}
          <BitmapChevron />
        </button>
      </div>
    </div>
  )
}
