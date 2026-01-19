"use client"

import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

const flashcardSets = [
  { id: "create", name: "Create New Set", description: "Build your own flashcard deck", icon: "+", isAction: true },
  {
    id: "ai-generate",
    name: "AI Generate",
    description: "Let AI create cards from a topic",
    icon: "◈",
    isAction: true,
  },
]

export default function FlashcardsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Review</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Flashcards</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Create and review flashcards to reinforce your learning. Use spaced repetition for optimal retention.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Cards</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Cards Due</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2 text-accent">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Mastered</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Review Streak</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcardSets.map((set) => (
            <Link
              key={set.id}
              href={`/protected/flashcards/${set.id}`}
              className="group border border-border p-6 hover:border-accent/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl opacity-60">{set.icon}</span>
                <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
                <ScrambleTextOnHover text={set.name} as="span" duration={0.5} />
              </h3>
              <p className="font-mono text-xs text-muted-foreground">{set.description}</p>
            </Link>
          ))}
        </div>

        {/* Your Sets */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Your Flashcard Sets</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No flashcard sets created yet. Create a new set or let AI generate one for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
