"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface UsageData {
  quiz: {
    used: number
    limit: number
    remaining: number
    percentUsed: number
    planType: string
  }
  flashcard: {
    used: number
    limit: number
    remaining: number
    percentUsed: number
    planType: string
  }
  daysUntilReset: number
}

export function UsageDisplay() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/usage")
        if (res.ok) {
          const data = await res.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Error fetching usage:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsage()
  }, [])

  if (loading) {
    return (
      <div className="border border-white/10 p-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
        <div className="h-2 bg-white/10 rounded w-full" />
      </div>
    )
  }

  if (!usage) return null

  const isPremium = usage.quiz.planType === "premium" || usage.quiz.planType === "enterprise"

  return (
    <div className="border border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-white/50">
          Usage This Month
        </span>
        <span className="text-xs font-mono text-white/30">
          Resets in {usage.daysUntilReset} days
        </span>
      </div>

      {/* Quiz Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-white/70">Quizzes</span>
          <span className={usage.quiz.remaining === 0 ? "text-red-400" : "text-white/50"}>
            {usage.quiz.used} / {usage.quiz.limit === -1 ? "Unlimited" : usage.quiz.limit}
          </span>
        </div>
        {usage.quiz.limit !== -1 && (
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                usage.quiz.percentUsed >= 100
                  ? "bg-red-500"
                  : usage.quiz.percentUsed >= 80
                    ? "bg-yellow-500"
                    : "bg-[#c9a45c]"
              }`}
              style={{ width: `${Math.min(100, usage.quiz.percentUsed)}%` }}
            />
          </div>
        )}
      </div>

      {/* Flashcard Usage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-white/70">Flashcards</span>
          <span className={usage.flashcard.remaining === 0 ? "text-red-400" : "text-white/50"}>
            {usage.flashcard.used} / {usage.flashcard.limit === -1 ? "Unlimited" : usage.flashcard.limit}
          </span>
        </div>
        {usage.flashcard.limit !== -1 && (
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                usage.flashcard.percentUsed >= 100
                  ? "bg-red-500"
                  : usage.flashcard.percentUsed >= 80
                    ? "bg-yellow-500"
                    : "bg-[#c9a45c]"
              }`}
              style={{ width: `${Math.min(100, usage.flashcard.percentUsed)}%` }}
            />
          </div>
        )}
      </div>

      {/* Upgrade prompt for free users */}
      {!isPremium && (
        <Link
          href="/protected/upgrade"
          className="block w-full mt-4 py-2 px-4 border border-[#c9a45c] text-[#c9a45c] text-center font-mono text-sm uppercase tracking-wider hover:bg-[#c9a45c] hover:text-black transition-colors"
        >
          Upgrade to Premium
        </Link>
      )}
    </div>
  )
}

export function UsageLimitModal({
  type,
  used,
  limit,
  onClose,
}: {
  type: "quiz" | "flashcard"
  used: number
  limit: number
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border border-white/10 max-w-md w-full p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-2 border-red-500/50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-mono uppercase tracking-wider">
            {type === "quiz" ? "Quiz" : "Flashcard"} Limit Reached
          </h2>
          <p className="text-white/60 font-mono text-sm">
            You've used all {limit} {type === "quiz" ? "quizzes" : "flashcard sets"} available on the free plan this month.
          </p>
        </div>

        <div className="border border-white/10 p-4 space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-wider text-[#c9a45c]">
            Upgrade to Premium
          </h3>
          <ul className="space-y-2 text-sm font-mono text-white/70">
            <li className="flex items-center gap-2">
              <span className="text-[#c9a45c]">+</span> 100 Quizzes per month
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a45c]">+</span> 100 Flashcard sets per month
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a45c]">+</span> 500 AI Tutor messages
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a45c]">+</span> Advanced Analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#c9a45c]">+</span> Priority Support
            </li>
          </ul>
          <p className="text-lg font-mono text-[#c9a45c]">$9.99/month</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/20 font-mono text-sm uppercase tracking-wider hover:border-white/40 transition-colors"
          >
            Maybe Later
          </button>
          <Link
            href="/protected/upgrade"
            className="flex-1 py-3 bg-[#c9a45c] text-black font-mono text-sm uppercase tracking-wider text-center hover:bg-[#d4af63] transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export function UsageBadge({ type }: { type: "quiz" | "flashcard" }) {
  const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number } | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/usage")
        if (res.ok) {
          const data = await res.json()
          setUsage(type === "quiz" ? data.quiz : data.flashcard)
        }
      } catch (error) {
        console.error("Error fetching usage:", error)
      }
    }
    fetchUsage()
  }, [type])

  if (!usage || usage.limit === -1) return null

  const isLow = usage.remaining <= 2 && usage.remaining > 0
  const isExhausted = usage.remaining === 0

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-mono ${
        isExhausted
          ? "bg-red-500/20 text-red-400 border border-red-500/30"
          : isLow
            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            : "bg-white/5 text-white/50 border border-white/10"
      }`}
    >
      {usage.remaining} / {usage.limit} remaining
    </span>
  )
}
