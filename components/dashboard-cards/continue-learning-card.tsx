"use client"

import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

export function ContinueLearningCard() {
  return (
    <div className="border border-border p-6 md:p-8 group hover:border-accent/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Get Started</p>
          <h3 className="font-[var(--font-bebas)] text-2xl tracking-wide mt-1">Begin Your Journey</h3>
        </div>
        <span className="text-lg opacity-40">▦</span>
      </div>

      <p className="font-mono text-xs text-muted-foreground mb-6">
        Choose a subject to start learning. Your progress will be saved automatically.
      </p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-muted-foreground">Progress</span>
          <span className="font-mono text-xs text-accent">0%</span>
        </div>
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-0 bg-accent"></div>
        </div>
      </div>

      <Link
        href="/protected/subjects"
        className="inline-flex items-center gap-3 border border-foreground/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
      >
        <ScrambleTextOnHover text="Explore Subjects" as="span" duration={0.6} />
        <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
      </Link>
    </div>
  )
}
