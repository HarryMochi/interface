import useSWR from "swr"

interface MetricsStats {
  totalRequests: number
  successCount: number
  errorCount: number
  successRate: number
  avgDuration: number
}

export function useAnalytics() {
  const { data, error, isLoading } = useSWR<MetricsStats>("/api/metrics")

  return {
    metrics: data,
    isLoading,
    isError: !!error,
    error,
  }
}
