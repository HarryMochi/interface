export function ProgressSnapshotCard() {
  return (
    <div className="border border-border p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Your Stats</p>
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mt-1">Progress</h3>
        </div>
        <span className="text-lg opacity-40">▲</span>
      </div>

      <div className="space-y-4">
        <div className="border-t border-foreground/10 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Completion Rate</p>
          <p className="font-[var(--font-bebas)] text-3xl tracking-wide mt-2 text-accent">0%</p>
        </div>

        <div className="border-t border-foreground/10 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Current Streak</p>
          <p className="font-[var(--font-bebas)] text-3xl tracking-wide mt-2">0 Days</p>
        </div>

        <div className="border-t border-foreground/10 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Topics Mastered</p>
          <p className="font-[var(--font-bebas)] text-3xl tracking-wide mt-2">0</p>
        </div>
      </div>
    </div>
  )
}
