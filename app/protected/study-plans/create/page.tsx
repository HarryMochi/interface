"use client"

import { useState } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"

const subjects = [
  { id: "mathematics", name: "Mathematics" },
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "computer-science", name: "Computer Science" },
  { id: "languages", name: "Languages" },
  { id: "history", name: "History" },
  { id: "economics", name: "Economics" },
]

export default function CreateStudyPlanPage() {
  const [planName, setPlanName] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [goal, setGoal] = useState("")
  const [dailyTime, setDailyTime] = useState(30)
  const [duration, setDuration] = useState("4-weeks")
  const [isCreating, setIsCreating] = useState(false)
  const [created, setCreated] = useState(false)

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleCreate = () => {
    if (!planName.trim() || selectedSubjects.length === 0) return

    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      setCreated(true)
    }, 1500)
  }

  if (created) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border p-8 text-center">
            <span className="text-4xl mb-4 block">✓</span>
            <h1 className="font-[var(--font-bebas)] text-3xl tracking-wide">Study Plan Created</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              Your study plan "{planName}" has been created with {selectedSubjects.length} subjects.
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              {dailyTime} minutes per day for {duration.replace("-", " ")}
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Link
                href="/protected/study-plans"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
              >
                View Study Plans
                <BitmapChevron />
              </Link>
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
          href="/protected/study-plans"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          <span className="rotate-180">
            <BitmapChevron />
          </span>
          Back to Study Plans
        </Link>

        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Create</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">New Study Plan</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Set your goals and let AI help you create a personalized study schedule.
          </p>
        </div>

        {/* Plan Name */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Plan Name
          </label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g., Exam Prep 2025, Weekly Review"
            className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>

        {/* Subject Selection */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Select Subjects
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => toggleSubject(subject.id)}
                className={`p-3 border text-left font-mono text-xs transition-all duration-200 ${
                  selectedSubjects.includes(subject.id)
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-foreground/10 hover:border-accent/50"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Goal */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Learning Goal (Optional)
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Prepare for final exams, Learn calculus fundamentals"
            rows={3}
            className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
          />
        </div>

        {/* Daily Time */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Daily Study Time
          </label>
          <div className="flex gap-3">
            {[15, 30, 45, 60, 90].map((time) => (
              <button
                key={time}
                onClick={() => setDailyTime(time)}
                className={`px-4 py-2 border font-mono text-xs transition-all duration-200 ${
                  dailyTime === time
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-foreground/20 hover:border-accent/50"
                }`}
              >
                {time} min
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="border border-border p-6">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            Plan Duration
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "1-week", label: "1 Week" },
              { id: "2-weeks", label: "2 Weeks" },
              { id: "4-weeks", label: "4 Weeks" },
              { id: "8-weeks", label: "8 Weeks" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`px-4 py-2 border font-mono text-xs transition-all duration-200 ${
                  duration === d.id
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-foreground/20 hover:border-accent/50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={!planName.trim() || selectedSubjects.length === 0 || isCreating}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isCreating ? "Creating Plan..." : "Create Study Plan"}
          <BitmapChevron />
        </button>
      </div>
    </div>
  )
}
