"use client"

import { use } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

// Topics data for each subject
const subjectTopics: Record<string, { id: string; name: string; description: string; duration: string }[]> = {
  mathematics: [
    {
      id: "algebra-basics",
      name: "Algebra Basics",
      description: "Variables, equations, and expressions",
      duration: "45 min",
    },
    {
      id: "linear-equations",
      name: "Linear Equations",
      description: "Solving and graphing linear equations",
      duration: "60 min",
    },
    {
      id: "quadratic-equations",
      name: "Quadratic Equations",
      description: "Factoring and quadratic formula",
      duration: "75 min",
    },
    { id: "functions", name: "Functions", description: "Domain, range, and function notation", duration: "60 min" },
    {
      id: "trigonometry",
      name: "Trigonometry",
      description: "Sine, cosine, tangent and applications",
      duration: "90 min",
    },
    {
      id: "calculus-intro",
      name: "Introduction to Calculus",
      description: "Limits, derivatives, and integrals basics",
      duration: "120 min",
    },
    {
      id: "statistics",
      name: "Statistics Fundamentals",
      description: "Mean, median, mode, and standard deviation",
      duration: "60 min",
    },
    {
      id: "probability",
      name: "Probability",
      description: "Basic probability theory and applications",
      duration: "75 min",
    },
  ],
  physics: [
    {
      id: "mechanics-intro",
      name: "Introduction to Mechanics",
      description: "Motion, forces, and Newton's laws",
      duration: "90 min",
    },
    {
      id: "kinematics",
      name: "Kinematics",
      description: "Velocity, acceleration, and motion equations",
      duration: "75 min",
    },
    { id: "dynamics", name: "Dynamics", description: "Forces, momentum, and energy", duration: "90 min" },
    {
      id: "thermodynamics",
      name: "Thermodynamics",
      description: "Heat, temperature, and energy transfer",
      duration: "80 min",
    },
    { id: "waves", name: "Waves and Oscillations", description: "Wave properties and behavior", duration: "70 min" },
    {
      id: "electromagnetism",
      name: "Electromagnetism",
      description: "Electric and magnetic fields",
      duration: "100 min",
    },
  ],
  chemistry: [
    {
      id: "atomic-structure",
      name: "Atomic Structure",
      description: "Atoms, electrons, and orbitals",
      duration: "60 min",
    },
    { id: "periodic-table", name: "Periodic Table", description: "Elements, groups, and trends", duration: "45 min" },
    {
      id: "chemical-bonding",
      name: "Chemical Bonding",
      description: "Ionic, covalent, and metallic bonds",
      duration: "75 min",
    },
    {
      id: "stoichiometry",
      name: "Stoichiometry",
      description: "Mole concept and chemical calculations",
      duration: "90 min",
    },
    {
      id: "organic-chemistry",
      name: "Organic Chemistry Basics",
      description: "Hydrocarbons and functional groups",
      duration: "100 min",
    },
    { id: "acids-bases", name: "Acids and Bases", description: "pH, neutralization, and buffers", duration: "70 min" },
  ],
  biology: [
    { id: "cell-structure", name: "Cell Structure", description: "Cell organelles and functions", duration: "60 min" },
    { id: "cell-division", name: "Cell Division", description: "Mitosis, meiosis, and cell cycle", duration: "75 min" },
    { id: "genetics", name: "Genetics", description: "DNA, genes, and inheritance", duration: "90 min" },
    { id: "evolution", name: "Evolution", description: "Natural selection and adaptation", duration: "80 min" },
    { id: "ecology", name: "Ecology", description: "Ecosystems and environmental interactions", duration: "70 min" },
    { id: "human-anatomy", name: "Human Anatomy", description: "Body systems and functions", duration: "120 min" },
  ],
  "computer-science": [
    {
      id: "programming-basics",
      name: "Programming Basics",
      description: "Variables, loops, and conditionals",
      duration: "60 min",
    },
    {
      id: "data-structures",
      name: "Data Structures",
      description: "Arrays, lists, trees, and graphs",
      duration: "90 min",
    },
    { id: "algorithms", name: "Algorithms", description: "Sorting, searching, and complexity", duration: "100 min" },
    {
      id: "oop",
      name: "Object-Oriented Programming",
      description: "Classes, objects, and inheritance",
      duration: "80 min",
    },
    { id: "databases", name: "Database Fundamentals", description: "SQL and database design", duration: "75 min" },
    {
      id: "web-development",
      name: "Web Development",
      description: "HTML, CSS, and JavaScript basics",
      duration: "90 min",
    },
    {
      id: "machine-learning",
      name: "Machine Learning Intro",
      description: "Basic ML concepts and algorithms",
      duration: "120 min",
    },
  ],
  languages: [
    {
      id: "english-grammar",
      name: "English Grammar",
      description: "Parts of speech and sentence structure",
      duration: "60 min",
    },
    {
      id: "english-writing",
      name: "English Writing",
      description: "Essay structure and composition",
      duration: "75 min",
    },
    { id: "spanish-basics", name: "Spanish Basics", description: "Common phrases and vocabulary", duration: "45 min" },
    { id: "french-basics", name: "French Basics", description: "Pronunciation and basic grammar", duration: "45 min" },
    {
      id: "vocabulary-building",
      name: "Vocabulary Building",
      description: "Word roots and expansion techniques",
      duration: "50 min",
    },
  ],
  history: [
    {
      id: "ancient-civilizations",
      name: "Ancient Civilizations",
      description: "Egypt, Greece, and Rome",
      duration: "90 min",
    },
    { id: "middle-ages", name: "The Middle Ages", description: "Medieval Europe and feudalism", duration: "75 min" },
    {
      id: "renaissance",
      name: "The Renaissance",
      description: "Art, science, and cultural rebirth",
      duration: "70 min",
    },
    {
      id: "industrial-revolution",
      name: "Industrial Revolution",
      description: "Technological and social changes",
      duration: "80 min",
    },
    { id: "world-wars", name: "World Wars", description: "WWI and WWII overview", duration: "100 min" },
    { id: "modern-history", name: "Modern History", description: "20th century to present", duration: "90 min" },
  ],
  economics: [
    {
      id: "microeconomics",
      name: "Microeconomics",
      description: "Supply, demand, and market equilibrium",
      duration: "75 min",
    },
    {
      id: "macroeconomics",
      name: "Macroeconomics",
      description: "GDP, inflation, and monetary policy",
      duration: "80 min",
    },
    {
      id: "international-trade",
      name: "International Trade",
      description: "Trade theories and globalization",
      duration: "70 min",
    },
    {
      id: "personal-finance",
      name: "Personal Finance",
      description: "Budgeting, saving, and investing",
      duration: "60 min",
    },
    {
      id: "market-structures",
      name: "Market Structures",
      description: "Competition and monopolies",
      duration: "65 min",
    },
  ],
}

const subjectInfo: Record<string, { name: string; icon: string; description: string }> = {
  mathematics: { name: "Mathematics", icon: "∑", description: "Master mathematical concepts from algebra to calculus" },
  physics: { name: "Physics", icon: "⚛", description: "Understand the fundamental laws of the universe" },
  chemistry: { name: "Chemistry", icon: "⚗", description: "Explore the science of matter and chemical reactions" },
  biology: { name: "Biology", icon: "🧬", description: "Study life and living organisms" },
  "computer-science": {
    name: "Computer Science",
    icon: "⌘",
    description: "Learn programming and computational thinking",
  },
  languages: { name: "Languages", icon: "文", description: "Develop language skills and communication" },
  history: { name: "History", icon: "⏳", description: "Explore events that shaped our world" },
  economics: { name: "Economics", icon: "📊", description: "Understand economic systems and principles" },
}

export default function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params)
  const topics = subjectTopics[subjectId] || []
  const subject = subjectInfo[subjectId] || {
    name: "Subject",
    icon: "◉",
    description: "Explore topics in this subject",
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/protected/subjects"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          <span className="rotate-180">
            <BitmapChevron />
          </span>
          Back to Subjects
        </Link>

        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl opacity-60">{subject.icon}</span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Subject</p>
              <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">{subject.name}</h1>
              <p className="font-mono text-sm text-muted-foreground mt-4">{subject.description}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Topics</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">{topics.length}</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Completed</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Progress</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2 text-accent">0%</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Est. Time</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">
              {Math.round(topics.reduce((acc, t) => acc + Number.parseInt(t.duration), 0) / 60)}h
            </p>
          </div>
        </div>

        {/* Topics List */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-6">Topics</h3>
          <div className="space-y-3">
            {topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/protected/subjects/${subjectId}/${topic.id}`}
                className="group flex items-center justify-between p-4 border border-foreground/10 hover:border-accent/50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-mono text-sm text-foreground group-hover:text-accent transition-colors">
                      <ScrambleTextOnHover text={topic.name} as="span" duration={0.4} />
                    </h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1">{topic.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {topic.duration}
                  </span>
                  <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
