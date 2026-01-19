"use client"

export default function SavedPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Library</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Saved Content</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Access your bookmarked topics, saved explanations, and personal notes.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Topics", "Explanations", "Notes", "Quizzes"].map((tab) => (
            <button
              key={tab}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-all duration-200 ${
                tab === "All"
                  ? "border-accent text-accent"
                  : "border-foreground/20 text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Saved Items */}
        <div className="border border-border p-6 md:p-8">
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground mb-4">
              No saved content yet. Bookmark topics, save AI explanations, or create notes while learning.
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Tip: Click the bookmark icon on any topic or explanation to save it here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
