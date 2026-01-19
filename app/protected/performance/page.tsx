"use client"

import { useAnalytics } from "@/lib/hooks/use-analytics"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PerformancePage() {
  const { metrics, isLoading, isError } = useAnalytics()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading analytics..." />
      </div>
    )
  }

  if (isError || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-mono mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-mono font-bold mb-8">Performance Metrics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{metrics.totalRequests}</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{Math.round(metrics.successRate)}%</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{metrics.avgDuration}ms</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono">Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{metrics.errorCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="font-mono">Request Summary (Last Hour)</CardTitle>
            <CardDescription className="font-mono text-xs">
              Successful: {metrics.successCount} | Failed: {metrics.errorCount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-mono mb-2">Success Rate: {Math.round(metrics.successRate)}%</p>
                <div className="w-full bg-secondary rounded h-2">
                  <div
                    className="bg-accent h-2 rounded transition-all duration-300"
                    style={{ width: `${metrics.successRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
