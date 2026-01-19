"use client"

import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

const subjects = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, Calculus, Statistics, Geometry and more",
    topics: 24,
    icon: "∑",
  },
  {
    id: "physics",
    name: "Physics",
    description: "Mechanics, Thermodynamics, Quantum Physics, Relativity",
    topics: 18,
    icon: "⚛",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Organic, Inorganic, Physical Chemistry, Biochemistry",
    topics: 20,
    icon: "⚗",
  },
  {
    id: "biology",
    name: "Biology",
    description: "Cell Biology, Genetics, Ecology, Human Anatomy",
    topics: 22,
    icon: "🧬",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    description: "Programming, Algorithms, Data Structures, AI/ML",
    topics: 28,
    icon: "⌘",
  },
  {
    id: "languages",
    name: "Languages",
    description: "English, Spanish, French, German, Japanese",
    topics: 15,
    icon: "文",
  },
  {
    id: "history",
    name: "History",
    description: "World History, Ancient Civilizations, Modern Era",
    topics: 16,
    icon: "⏳",
  },
  {
    id: "economics",
    name: "Economics",
    description: "Microeconomics, Macroeconomics, Finance, Trade",
    topics: 14,
    icon: "📊",
  },
]

export default function SubjectsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Explore</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Subjects</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Choose a subject to begin learning. Each subject contains multiple topics with AI-powered explanations.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/protected/subjects/${subject.id}`}
              className="group border border-border p-6 hover:border-accent/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl opacity-60">{subject.icon}</span>
                <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
                <ScrambleTextOnHover text={subject.name} as="span" duration={0.5} />
              </h3>
              <p className="font-mono text-xs text-muted-foreground mb-4">{subject.description}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {subject.topics} Topics
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
