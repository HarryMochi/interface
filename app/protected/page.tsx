"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ContinueLearningCard } from "@/components/dashboard-cards/continue-learning-card"
import { RecentTopicsCard } from "@/components/dashboard-cards/recent-topics-card"
import { QuickActionsCard } from "@/components/dashboard-cards/quick-actions-card"
import { ProgressSnapshotCard } from "@/components/dashboard-cards/progress-snapshot-card"
import { WelcomeAnimation } from "@/components/dashboard-cards/welcome-animation"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [studentName, setStudentName] = useState("")
  const [grade, setGrade] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()

        if (userData.user) {
          const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userData.user.id).single()

          if (profile) {
            setStudentName(profile.student_name)
            setGrade(profile.grade)

            // Check if this is the user's first visit (no quiz/flashcard results yet)
            const { data: quizzes } = await supabase
              .from("quiz_results")
              .select("id")
              .eq("user_id", userData.user.id)
              .limit(1)

            const { data: flashcards } = await supabase
              .from("flashcard_results")
              .select("id")
              .eq("user_id", userData.user.id)
              .limit(1)

            if (!quizzes?.length && !flashcards?.length) {
              setIsNewUser(true)
              setShowWelcome(true)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <div className="flex flex-col h-full">
      {showWelcome && (
        <WelcomeAnimation studentName={studentName} isNewUser={isNewUser} onComplete={() => setShowWelcome(false)} />
      )}

      <DashboardHeader />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome section - personalized with user's name */}
          <div className="border border-border p-6 md:p-8">
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mb-2">
              Welcome back, {studentName}
            </h1>
            <p className="font-mono text-sm text-muted-foreground">
              Grade: {grade} • Your personalized AI learning companion. Start by exploring subjects or asking the AI
              Tutor a question.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - larger cards */}
            <div className="lg:col-span-2 space-y-6">
              <ContinueLearningCard />
              <RecentTopicsCard />
            </div>

            {/* Right column - sidebar cards */}
            <div className="space-y-6">
              <ProgressSnapshotCard />
              <QuickActionsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
