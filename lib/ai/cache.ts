const CACHE_DURATION_MINUTES = 60

interface CacheKey {
  type: "quiz" | "flashcard"
  subject: string
  grade: string
  difficulty: string
  count: number
}

interface CachedContent {
  data: unknown
  timestamp: number
}

// In-memory cache with TTL
const memoryCache = new Map<string, CachedContent>()

function generateCacheKey(key: CacheKey): string {
  return `${key.type}:${key.subject}:${key.grade}:${key.difficulty}:${key.count}`
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MINUTES * 60 * 1000
}

export function getCachedContent(key: CacheKey): unknown | null {
  const cacheKey = generateCacheKey(key)
  const cached = memoryCache.get(cacheKey)

  if (cached && isCacheValid(cached.timestamp)) {
    console.log("[v0] Cache HIT:", cacheKey)
    return cached.data
  }

  if (cached) {
    memoryCache.delete(cacheKey)
  }
  return null
}

export function setCachedContent(key: CacheKey, data: unknown): void {
  const cacheKey = generateCacheKey(key)
  memoryCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  })
  console.log("[v0] Cache SET:", cacheKey)
}

export function clearCache(): void {
  memoryCache.clear()
}
