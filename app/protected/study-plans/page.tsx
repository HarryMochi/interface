"use client"

import Link from "next/link"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { ScrambleTextOnHover } from "@/components/scramble-text"

export default function StudyPlansPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Plan</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Study Plans</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Create personalized study plans with AI assistance. Set goals, track progress, and stay on schedule.
          </p>
        </div>

        {/* Create Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/protected/study-plans/create"
            className="group border border-border p-6 hover:border-accent/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl opacity-60">+</span>
              <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
              <ScrambleTextOnHover text="Create Study Plan" as="span" duration={0.5} />
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Define your goals and let AI build a personalized plan
            </p>
          </Link>

          <Link
            href="/protected/study-plans/templates"
            className="group border border-border p-6 hover:border-accent/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl opacity-60">◫</span>
              <BitmapChevron className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-2">
              <ScrambleTextOnHover text="Use Template" as="span" duration={0.5} />
            </h3>
            <p className="font-mono text-xs text-muted-foreground">Start with a pre-built study plan template</p>
          </Link>
        </div>

        {/* Active Plans */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Active Study Plans</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No active study plans. Create a plan to organize your learning journey.
            </p>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Upcoming Sessions</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No scheduled sessions. Create a study plan to see your upcoming sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
