"use client"

import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

const quizCategories = [
  { id: "quick", name: "Quick Quiz", description: "5 questions, 5 minutes", icon: "⚡" },
  { id: "standard", name: "Standard Quiz", description: "15 questions, 15 minutes", icon: "◉" },
  { id: "challenge", name: "Challenge Mode", description: "25 questions, timed", icon: "◆" },
  { id: "practice", name: "Practice Mode", description: "Unlimited, no timer", icon: "∞" },
]

export default function QuizzesPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Practice</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Practice & Quizzes</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Test your knowledge with AI-generated quizzes. Choose a mode to get started.
          </p>
        </div>

        {/* Quiz Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Quizzes Taken</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Avg Score</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2 text-accent">0%</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Best Streak</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Questions</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
        </div>

        {/* Quiz Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizCategories.map((category) => (
            <Link
              key={category.id}
              href={`/protected/quizzes/${category.id}`}
              className="group border border-border p-6 hover:border-accent/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl opacity-60">{category.icon}</span>
                <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
                <ScrambleTextOnHover text={category.name} as="span" duration={0.5} />
              </h3>
              <p className="font-mono text-xs text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Quizzes */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Recent Quizzes</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No quizzes taken yet. Start a quiz to track your progress here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
