"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { BitmapChevron } from "@/components/bitmap-chevron"

interface QuizResult {
  id: string
  subject: string
  difficulty: string
  score: number
  total_questions: number
  time_limit_minutes: number | null
  created_at: string
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()

        if (userData.user) {
          const { data } = await supabase
            .from("quiz_results")
            .select("*")
            .eq("user_id", userData.user.id)
            .order("created_at", { ascending: false })

          setResults(data || [])
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  const getAverageScore = () => {
    if (results.length === 0) return 0
    const total = results.reduce((sum, r) => sum + (r.score / r.total_questions) * 100, 0)
    return Math.round(total / results.length)
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <Link
            href="/protected/quizzes"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors mb-4"
          >
            <span className="rotate-180">
              <BitmapChevron />
            </span>
            Back to Quizzes
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Analytics</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Quiz Results</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Track your quiz performance and progress over time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Quizzes</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">{results.length}</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Average Score</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2 text-accent">{getAverageScore()}%</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Highest Score</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">
              {results.length > 0
                ? Math.round(Math.max(...results.map((r) => (r.score / r.total_questions) * 100)) as any)
                : 0}
              %
            </p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Questions</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">
              {results.reduce((sum, r) => sum + r.total_questions, 0)}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Recent Quizzes</h3>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="font-mono text-sm text-muted-foreground">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="border border-dashed border-foreground/20 p-8 text-center">
              <p className="font-mono text-xs text-muted-foreground">
                No quiz results yet. Take a quiz to see your results here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10">
                    <th className="text-left py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Subject
                    </th>
                    <th className="text-left py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Difficulty
                    </th>
                    <th className="text-left py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Score
                    </th>
                    <th className="text-left py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Time
                    </th>
                    <th className="text-left py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors"
                    >
                      <td className="py-4 font-mono text-sm">{result.subject}</td>
                      <td className="py-4 font-mono text-sm capitalize">{result.difficulty}</td>
                      <td className="py-4 font-mono text-sm">
                        <span className="text-accent">
                          {Math.round((result.score / result.total_questions) * 100)}%
                        </span>{" "}
                        ({result.score}/{result.total_questions})
                      </td>
                      <td className="py-4 font-mono text-sm">
                        {result.time_limit_minutes ? `${result.time_limit_minutes}m` : "Unlimited"}
                      </td>
                      <td className="py-4 font-mono text-sm text-muted-foreground">
                        {new Date(result.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
