interface RetryConfig {
  maxAttempts: number
  delayMs: number
  backoffMultiplier: number
}

const DEFAULT_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
}

export async function retryWithBackoff<T>(fn: () => Promise<T>, config: RetryConfig = DEFAULT_CONFIG): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.log(`[v0] Attempt ${attempt + 1} failed, retrying...`)

      if (attempt < config.maxAttempts - 1) {
        const delay = config.delayMs * Math.pow(config.backoffMultiplier, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Request failed after retries")
}
