import Link from "next/link"

const quickActions = [
  { label: "Start Quiz", href: "/protected/quizzes", icon: "▢" },
  { label: "Review Flashcards", href: "/protected/flashcards", icon: "▭" },
  { label: "Ask AI Tutor", href: "/protected/tutor", icon: "◆" },
]

export function QuickActionsCard() {
  return (
    <div className="border border-border p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Actions</p>
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mt-1">Quick Start</h3>
        </div>
        <span className="text-lg opacity-40">★</span>
      </div>

      <div className="space-y-2">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between w-full p-3 border border-foreground/10 hover:border-accent hover:bg-secondary/50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg opacity-60">{action.icon}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-foreground group-hover:text-accent transition-colors">
                {action.label}
              </span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
