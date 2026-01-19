interface RequestMetric {
  userId: string
  type: "quiz" | "flashcard"
  timestamp: number
  duration: number
  status: "success" | "error"
  error?: string
  subject?: string
  difficulty?: string
  count?: number
}

const metrics: RequestMetric[] = []

export function recordMetric(metric: RequestMetric): void {
  metrics.push(metric)
  // Keep only last 1000 metrics in memory
  if (metrics.length > 1000) {
    metrics.shift()
  }
}

export function getMetrics(userId?: string): RequestMetric[] {
  if (userId) {
    return metrics.filter((m) => m.userId === userId)
  }
  return metrics
}

export function getMetricsStats(userId?: string) {
  const userMetrics = userId ? metrics.filter((m) => m.userId === userId) : metrics
  const now = Date.now()
  const hourAgo = now - 60 * 60 * 1000

  const recentMetrics = userMetrics.filter((m) => m.timestamp > hourAgo)
  const successCount = recentMetrics.filter((m) => m.status === "success").length
  const errorCount = recentMetrics.filter((m) => m.status === "error").length
  const avgDuration =
    recentMetrics.length > 0 ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length : 0

  return {
    totalRequests: recentMetrics.length,
    successCount,
    errorCount,
    successRate: recentMetrics.length > 0 ? (successCount / recentMetrics.length) * 100 : 0,
    avgDuration: Math.round(avgDuration),
  }
}
