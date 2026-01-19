"use client"

import { useState } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

const templates = [
  {
    id: "exam-prep",
    name: "Exam Preparation",
    description: "Intensive 4-week plan for upcoming exams",
    duration: "4 weeks",
    dailyTime: "60 min",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    icon: "◉",
  },
  {
    id: "daily-review",
    name: "Daily Review",
    description: "Light daily review to maintain knowledge",
    duration: "Ongoing",
    dailyTime: "15 min",
    subjects: ["All Subjects"],
    icon: "◎",
  },
  {
    id: "deep-dive",
    name: "Deep Dive",
    description: "Focus on one subject for mastery",
    duration: "8 weeks",
    dailyTime: "45 min",
    subjects: ["Single Subject"],
    icon: "◆",
  },
  {
    id: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Concentrated weekend study sessions",
    duration: "12 weeks",
    dailyTime: "120 min (weekends)",
    subjects: ["Flexible"],
    icon: "▣",
  },
  {
    id: "language-immersion",
    name: "Language Immersion",
    description: "Daily language practice for fluency",
    duration: "12 weeks",
    dailyTime: "30 min",
    subjects: ["Languages"],
    icon: "文",
  },
  {
    id: "stem-focus",
    name: "STEM Focus",
    description: "Balanced STEM subjects study plan",
    duration: "6 weeks",
    dailyTime: "45 min",
    subjects: ["Math", "Physics", "Chemistry", "CS"],
    icon: "∑",
  },
]

export default function StudyPlanTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  const handleApply = () => {
    if (!selectedTemplate) return
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      setApplied(true)
    }, 1500)
  }

  const template = templates.find((t) => t.id === selectedTemplate)

  if (applied && template) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border p-8 text-center">
            <span className="text-4xl mb-4 block">✓</span>
            <h1 className="font-[var(--font-bebas)] text-3xl tracking-wide">Template Applied</h1>
            <p className="font-mono text-sm text-muted-foreground mt-4">
              The "{template.name}" template has been applied to your study plans.
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
      <div className="max-w-5xl mx-auto space-y-6">
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
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Templates</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Study Plan Templates</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Choose a pre-built template to get started quickly.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t.id)}
              className={`group text-left border p-6 transition-all duration-200 ${
                selectedTemplate === t.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl opacity-60">{t.icon}</span>
                {selectedTemplate === t.id && <span className="text-accent text-sm">✓</span>}
              </div>
              <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
                <ScrambleTextOnHover text={t.name} as="span" duration={0.5} />
              </h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">{t.description}</p>
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Duration: <span className="text-foreground">{t.duration}</span>
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Daily: <span className="text-foreground">{t.dailyTime}</span>
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Apply Button */}
        {selectedTemplate && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isApplying ? "Applying Template..." : `Apply ${template?.name} Template`}
            <BitmapChevron />
          </button>
        )}
      </div>
    </div>
  )
}
