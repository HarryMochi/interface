import Link from "next/link"

const topics = [
  { title: "Photosynthesis", subject: "Biology", completion: 45 },
  { title: "Linear Equations", subject: "Mathematics", completion: 78 },
  { title: "French Verbs", subject: "Languages", completion: 32 },
]

export function RecentTopicsCard() {
  return (
    <div className="border border-border p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Recents</p>
          <h3 className="font-[var(--font-bebas)] text-2xl tracking-wide mt-1">Recent Topics</h3>
        </div>
        <span className="text-lg opacity-40">◉</span>
      </div>

      {topics.length === 0 ? (
        <div className="border border-dashed border-foreground/20 p-8 flex flex-col items-center justify-center text-center">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            No topics studied yet. Start exploring subjects to see your recent activity here.
          </p>
          <Link
            href="/protected/subjects"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            Browse Subjects
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={`/protected/topic/${topic.title.toLowerCase().replace(" ", "-")}`}
              className="flex items-center justify-between p-4 border border-foreground/10 hover:border-accent/50 hover:bg-secondary/50 transition-all duration-200"
            >
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-widest text-foreground">{topic.title}</p>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">{topic.subject}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-accent">{topic.completion}%</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
