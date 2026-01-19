"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import gsap from "gsap"

const GRADES = [
  "Elementary School (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "Undergraduate",
  "Graduate",
  "Self-Learner",
]

const LEARNING_STYLES = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"]
const LEARNING_GOALS = ["Improve grades", "Prepare for exams", "Learn new skills", "Review fundamentals"]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [studentName, setStudentName] = useState("")
  const [grade, setGrade] = useState("")
  const [learningStyle, setLearningStyle] = useState("")
  const [learningGoal, setLearningGoal] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
    }
  }, [step])

  const handleNext = () => {
    if (step === 1 && !studentName.trim()) {
      setError("Please enter your name")
      return
    }
    if (step === 2 && !grade) {
      setError("Please select your grade")
      return
    }
    if (step === 3 && !learningStyle) {
      setError("Please select your learning style")
      return
    }
    setError(null)
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!learningGoal) {
      setError("Please select your learning goal")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: userData, error: authError } = await supabase.auth.getUser()
      console.log("[v0] User data:", userData)
      console.log("[v0] Auth error:", authError)

      if (!userData.user || authError) {
        throw new Error("User not authenticated: " + (authError?.message || "Unknown error"))
      }

      console.log("[v0] Creating/updating profile for user:", userData.user.id)

      const { data, error: profileError } = await supabase
        .from("user_profiles")
        .upsert([
          {
            id: userData.user.id,
            student_name: studentName,
            grade,
            learning_style: learningStyle,
            learning_goals: learningGoal,
          },
        ])
        .select()

      console.log("[v0] Profile creation/update response:", { data, error: profileError })

      if (profileError) {
        throw new Error(`Profile operation failed: ${profileError.message}`)
      }

      router.push("/protected/welcome")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.log("[v0] Error during profile operation:", errorMessage)
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full flex items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-12 flex justify-between items-center gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`flex-1 h-1 ${s <= step ? "bg-accent" : "bg-foreground/10"} transition-all duration-300`}
              />
              <span className="font-mono text-xs uppercase text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>

        <div ref={contentRef} className="border border-border p-8 md:p-12">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mb-2">What's Your Name?</h2>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Let's get to know you better
                </p>
              </div>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Grade */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mb-2">What's Your Grade Level?</h2>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  This helps us personalize your content
                </p>
              </div>
              <div className="space-y-3">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`w-full text-left p-4 border transition-all duration-200 ${
                      grade === g
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-foreground/10 text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    <span className="font-mono text-sm">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Learning Style */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mb-2">How Do You Learn Best?</h2>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Select your preferred learning style
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setLearningStyle(style)}
                    className={`p-4 border transition-all duration-200 ${
                      learningStyle === style
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-foreground/10 text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    <span className="font-mono text-sm">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Goal */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mb-2">What's Your Main Goal?</h2>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                  Help us align your learning journey
                </p>
              </div>
              <div className="space-y-3">
                {LEARNING_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setLearningGoal(goal)}
                    className={`w-full text-left p-4 border transition-all duration-200 ${
                      learningGoal === goal
                        ? "border-accent bg-accent/5 text-foreground"
                        : "border-foreground/10 text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    <span className="font-mono text-sm">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">
              {error}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-foreground/20 px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all"
              >
                Back
              </button>
            )}
            <button
              onClick={step === 4 ? handleSubmit : handleNext}
              disabled={isLoading}
              className="flex-1 border border-accent px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:bg-accent/5 transition-all disabled:opacity-50"
            >
              {isLoading ? "Setting up..." : step === 4 ? "Complete Setup" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
