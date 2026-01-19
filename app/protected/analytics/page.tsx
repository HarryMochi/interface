"use client"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Insights</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Progress & Analytics</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Track your learning journey with detailed insights and performance metrics.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Total Study Time</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0h</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Topics Completed</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Quiz Accuracy</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2 text-accent">0%</p>
          </div>
          <div className="border border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Current Streak</p>
            <p className="font-[var(--font-bebas)] text-2xl tracking-wide mt-2">0 days</p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Weekly Activity</h3>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{day}</p>
                <div className="h-24 border border-dashed border-foreground/20 flex items-end justify-center p-2">
                  <div className="w-full bg-secondary h-0 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-muted-foreground text-center mt-4">
            Start studying to see your activity chart
          </p>
        </div>

        {/* Subject Performance */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Subject Performance</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No subject data yet. Complete topics to see your performance breakdown.
            </p>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4">Learning Goals</h3>
          <div className="border border-dashed border-foreground/20 p-8 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              No goals set. Create a study plan to track your learning objectives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
