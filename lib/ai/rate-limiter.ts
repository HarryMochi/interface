interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface UserRateLimit {
  count: number
  resetTime: number
}

const userLimits = new Map<string, UserRateLimit>()

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
}

export function checkRateLimit(userId: string, config: RateLimitConfig = DEFAULT_CONFIG): boolean {
  const now = Date.now()
  const userLimit = userLimits.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    userLimits.set(userId, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return true
  }

  if (userLimit.count >= config.maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

export function getRateLimitStatus(userId: string): { remaining: number; resetTime: Date } {
  const userLimit = userLimits.get(userId)
  const now = Date.now()

  if (!userLimit || now > userLimit.resetTime) {
    return {
      remaining: DEFAULT_CONFIG.maxRequests,
      resetTime: new Date(now + DEFAULT_CONFIG.windowMs),
    }
  }

  return {
    remaining: Math.max(0, DEFAULT_CONFIG.maxRequests - userLimit.count),
    resetTime: new Date(userLimit.resetTime),
  }
}
