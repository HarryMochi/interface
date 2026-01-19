"use client"

import { use, useState } from "react"
import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"

// Topic content data
const topicContent: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  "algebra-basics": {
    title: "Algebra Basics",
    sections: [
      {
        heading: "What is Algebra?",
        content:
          "Algebra is a branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations. It forms the foundation for advanced mathematics and is essential for solving real-world problems.",
      },
      {
        heading: "Variables and Constants",
        content:
          "A variable is a symbol (usually a letter like x, y, or z) that represents an unknown value. A constant is a fixed value that doesn't change. In the expression 3x + 5, x is a variable and 3 and 5 are constants.",
      },
      {
        heading: "Expressions vs Equations",
        content:
          "An expression is a combination of numbers, variables, and operations (like 2x + 3). An equation states that two expressions are equal (like 2x + 3 = 7). The key difference is that equations have an equals sign.",
      },
      {
        heading: "Basic Operations",
        content:
          "In algebra, you can add, subtract, multiply, and divide terms that contain variables. Like terms (terms with the same variable raised to the same power) can be combined: 3x + 2x = 5x.",
      },
    ],
  },
  default: {
    title: "Topic Content",
    sections: [
      {
        heading: "Introduction",
        content:
          "This topic covers fundamental concepts that will help you build a strong foundation. Take your time to understand each section before moving on.",
      },
      {
        heading: "Key Concepts",
        content:
          "Understanding the core principles is essential for mastering this subject. Focus on the relationships between different ideas and how they connect to form a complete picture.",
      },
      {
        heading: "Practical Applications",
        content:
          "Theory becomes meaningful when applied to real-world scenarios. Look for examples in your daily life where these concepts appear and try to analyze them using what you've learned.",
      },
      {
        heading: "Summary",
        content:
          "Review the main points covered in this topic. Make sure you can explain each concept in your own words before proceeding to practice problems or related topics.",
      },
    ],
  },
}

export default function TopicPage({ params }: { params: Promise<{ subjectId: string; topicId: string }> }) {
  const { subjectId, topicId } = use(params)
  const [activeSection, setActiveSection] = useState(0)
  const [showAIExplanation, setShowAIExplanation] = useState(false)
  const [aiExplanation, setAiExplanation] = useState("")
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const content = topicContent[topicId] || topicContent.default
  const topicTitle = topicId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  const handleAskAI = async () => {
    setIsLoadingAI(true)
    setShowAIExplanation(true)

    // Simulate AI response
    setTimeout(() => {
      setAiExplanation(
        `Here's a simplified explanation of "${content.sections[activeSection].heading}":\n\n` +
          `Think of it this way: ${content.sections[activeSection].content}\n\n` +
          `A helpful analogy: Imagine you're organizing a bookshelf. Just like how similar books go together, ` +
          `in this topic, related concepts group together to form a coherent understanding.\n\n` +
          `Key takeaway: Focus on understanding the "why" behind each concept, not just memorizing the "what".`,
      )
      setIsLoadingAI(false)
    }, 1500)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Back Link */}
        <Link
          href={`/protected/subjects/${subjectId}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors"
        >
          <span className="rotate-180">
            <BitmapChevron />
          </span>
          Back to Topics
        </Link>

        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Learning</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">{topicTitle}</h1>
          <div className="flex items-center gap-4 mt-4">
            <span className="font-mono text-xs text-muted-foreground">
              Section {activeSection + 1} of {content.sections.length}
            </span>
            <div className="flex-1 h-1 bg-secondary">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((activeSection + 1) / content.sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Sections</p>
            {content.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveSection(index)
                  setShowAIExplanation(false)
                }}
                className={`w-full text-left p-3 border transition-all duration-200 ${
                  activeSection === index
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-foreground/10 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs">{section.heading}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-border p-6 md:p-8">
              <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mb-6">
                {content.sections[activeSection].heading}
              </h2>
              <p className="font-mono text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {content.sections[activeSection].content}
              </p>
            </div>

            {/* AI Explanation */}
            {showAIExplanation && (
              <div className="border border-accent/30 bg-accent/5 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-accent">◆</span>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">AI Explanation</p>
                </div>
                {isLoadingAI ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-100"></span>
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></span>
                  </div>
                ) : (
                  <p className="font-mono text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                    {aiExplanation}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAskAI}
                disabled={isLoadingAI}
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-all duration-200"
              >
                <span>◆</span>
                Explain with AI
              </button>

              <button
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent disabled:opacity-30 transition-all duration-200"
              >
                <span className="rotate-180">
                  <BitmapChevron />
                </span>
                Previous
              </button>

              {activeSection < content.sections.length - 1 ? (
                <button
                  onClick={() => {
                    setActiveSection(activeSection + 1)
                    setShowAIExplanation(false)
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
                >
                  Next
                  <BitmapChevron />
                </button>
              ) : (
                <Link
                  href={`/protected/subjects/${subjectId}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-accent bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-all duration-200"
                >
                  Complete Topic
                  <BitmapChevron />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
