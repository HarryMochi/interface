"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { createClient } from "@/lib/supabase/client"

const quizModeConfig: Record<string, { name: string; questions: number; timeLimit: string; description: string }> = {
  quick: { name: "Quick Quiz", questions: 5, timeLimit: "5 minutes", description: "Fast-paced review of key concepts" },
  standard: {
    name: "Standard Quiz",
    questions: 15,
    timeLimit: "15 minutes",
    description: "Comprehensive knowledge check",
  },
  challenge: {
    name: "Challenge Mode",
    questions: 25,
    timeLimit: "25 minutes",
    description: "Test your mastery under pressure",
  },
  practice: {
    name: "Practice Mode",
    questions: 10,
    timeLimit: "No limit",
    description: "Learn at your own pace with explanations",
  },
}

const subjects = [
  { id: "mathematics", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "computer-science", name: "Computer Science" },
  { id: "english", name: "English" },
  { id: "history", name: "History" },
  { id: "mixed", name: "Mixed (All Subjects)" },
]

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export default function QuizModePage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode } = use(params)
  const config = quizModeConfig[mode] || quizModeConfig.standard

  const [step, setStep] = useState<"setup" | "difficulty" | "quiz" | "results">("setup")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [customQuestions, setCustomQuestions] = useState(config.questions)
  const [customTimeLimit, setCustomTimeLimit] = useState(
    config.timeLimit === "No limit" ? 0 : Number.parseInt(config.timeLimit),
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<(string | null)[]>([])
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

  const handleGenerateQuiz = async () => {
    if (!selectedSubject) {
      setError("Please select a subject")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          grade: userGrade,
          difficulty,
          numQuestions: customQuestions,
          learningStyle: "mixed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate quiz")
      }

      const data = await response.json()
      setQuestions(data.questions)
      setAnswers(new Array(data.questions.length).fill(null))
      setStep("quiz")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz")
      setIsGenerating(false)
    }
  }

  const handleSelectAnswer = (option: string) => {
    if (showExplanation) return
    setSelectedAnswer(option)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    const question = questions[currentQuestion]
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1)
    }

    if (mode === "practice") {
      setShowExplanation(true)
    } else {
      handleNextQuestion()
    }
  }

  const handleNextQuestion = () => {
    setShowExplanation(false)
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      saveQuizResults()
      setStep("results")
    }
  }

  const saveQuizResults = async () => {
    try {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user) {
        await supabase.from("quiz_results").insert([
          {
            user_id: userData.user.id,
            subject: selectedSubject,
            difficulty,
            num_questions: questions.length,
            time_limit_minutes: customTimeLimit,
            score,
            total_questions: questions.length,
            completed: true,
          },
        ])
      }
    } catch (error) {
      console.error("Error saving quiz results:", error)
    }
  }

  const resetQuiz = () => {
    setStep("setup")
    setSelectedSubject("")
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setQuestions([])
    setAnswers([])
  }

  // ===== Setup Step =====
  if (step === "setup") {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/protected/quizzes"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
          >
            <span className="rotate-180">
              <BitmapChevron />
            </span>
            Back to Quizzes
          </Link>

          <div className="border border-border p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Setup</p>
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">{config.name}</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">{config.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border border-foreground/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Questions</p>
                <p className="font-[var(--font-bebas)] text-xl mt-1">{config.questions}</p>
              </div>
              <div className="border border-foreground/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Time Limit</p>
                <p className="font-[var(--font-bebas)] text-xl mt-1">{config.timeLimit}</p>
              </div>
            </div>
          </div>

          <div className="border border-border p-6 md:p-8">
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Select Subject</h3>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-4 border text-left font-mono text-sm transition-all duration-200 ${
                    selectedSubject === subject.id
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
          )}

          <button
            onClick={() => {
              if (!selectedSubject) {
                setError("Please select a subject")
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
            <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Quiz Settings</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              Choose difficulty level and customize the quiz parameters
            </p>
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
                    {level === "beginner" && "Basic concepts"}
                    {level === "intermediate" && "Moderate depth"}
                    {level === "advanced" && "Complex topics"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border p-6 md:p-8">
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Number of Questions</h3>
            <div className="flex gap-3 mb-4">
              {[5, 10, 15, 20, 25].map((num) => (
                <button
                  key={num}
                  onClick={() => setCustomQuestions(num)}
                  className={`px-4 py-2 border font-mono text-sm transition-all duration-200 ${
                    customQuestions === num
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
              value={customQuestions}
              onChange={(e) => setCustomQuestions(Math.max(1, Math.min(50, Number.parseInt(e.target.value) || 1)))}
              className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          <div className="border border-border p-6 md:p-8">
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Time Limit (minutes)</h3>
            <div className="flex gap-3 mb-4">
              {[0, 5, 10, 15, 20].map((time) => (
                <button
                  key={time}
                  onClick={() => setCustomTimeLimit(time)}
                  className={`px-4 py-2 border font-mono text-sm transition-all duration-200 ${
                    customTimeLimit === time
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  {time === 0 ? "No limit" : time}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="0"
              max="120"
              value={customTimeLimit}
              onChange={(e) => setCustomTimeLimit(Math.max(0, Math.min(120, Number.parseInt(e.target.value) || 0)))}
              className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => setStep("setup")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
            >
              Back
            </button>
            <button
              onClick={handleGenerateQuiz}
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
                  Generate Quiz
                  <BitmapChevron />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ===== Quiz Step =====
  if (step === "quiz" && questions.length > 0) {
    const question = questions[currentQuestion]
    const correctOption =
      question.options[
        question.options.indexOf(
          question.options.find((opt) => opt.endsWith(question.correctAnswer)) || question.correctAnswer,
        )
      ]

    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress */}
          <div className="border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="font-mono text-xs text-accent">Score: {score}</span>
            </div>
            <div className="h-1 bg-secondary">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="border border-border p-6 md:p-8">
            <h2 className="font-mono text-lg text-foreground mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 border font-mono text-sm transition-all duration-200 ${
                    showExplanation
                      ? option === question.correctAnswer
                        ? "border-green-500 bg-green-500/10 text-green-500"
                        : selectedAnswer === option
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-foreground/10 opacity-50"
                      : selectedAnswer === option
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  <span className="mr-3 opacity-50">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="border border-accent/30 bg-accent/5 p-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">Explanation</p>
              <p className="font-mono text-sm text-foreground/90">{question.explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Submit Answer
                <BitmapChevron />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                <BitmapChevron />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ===== Results Step =====
  if (step === "results") {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-border p-8 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Quiz Complete</p>
            <h1 className="font-[var(--font-bebas)] text-4xl tracking-wide mt-4">Results</h1>

            <div className="my-8">
              <p className="font-[var(--font-bebas)] text-6xl text-accent">
                {Math.round((score / questions.length) * 100)}%
              </p>
              <p className="font-mono text-sm text-muted-foreground mt-2">
                {score} of {questions.length} correct
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
              >
                Try Again
              </button>
              <Link
                href="/protected/quizzes"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
              >
                Back to Quizzes
                <BitmapChevron />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
