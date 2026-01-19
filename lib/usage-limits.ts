import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Configurable limits - can be adjusted here for easy scaling
export const PLAN_LIMITS = {
  free: {
    quizzes: 5,
    flashcards: 5,
    tutorMessages: 20,
  },
  premium: {
    quizzes: 100,
    flashcards: 100,
    tutorMessages: 500,
  },
  enterprise: {
    quizzes: -1, // -1 means unlimited
    flashcards: -1,
    tutorMessages: -1,
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS
export type UsageType = "quiz" | "flashcard" | "tutor"

export interface UsageStatus {
  allowed: boolean
  used: number
  limit: number
  remaining: number
  planType: PlanType
  isUnlimited: boolean
  percentUsed: number
  upgradeRequired: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_type: PlanType
  quiz_limit: number
  flashcard_limit: number
  tutor_messages_limit: number
  quizzes_used: number
  flashcards_used: number
  tutor_messages_used: number
  usage_reset_date: string
}

async function getSupabaseClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await getSupabaseClient()
  
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    // Auto-create free subscription if it doesn't exist
    const { data: newSub, error: createError } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        plan_type: "free",
        quiz_limit: PLAN_LIMITS.free.quizzes,
        flashcard_limit: PLAN_LIMITS.free.flashcards,
        tutor_messages_limit: PLAN_LIMITS.free.tutorMessages,
        quizzes_used: 0,
        flashcards_used: 0,
        tutor_messages_used: 0,
        usage_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (createError) {
      console.error("[v0] Error creating subscription:", createError)
      return null
    }
    return newSub as UserSubscription
  }

  // Check if usage needs to be reset
  if (new Date(data.usage_reset_date) <= new Date()) {
    const { data: resetData } = await supabase
      .from("user_subscriptions")
      .update({
        quizzes_used: 0,
        flashcards_used: 0,
        tutor_messages_used: 0,
        usage_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    return resetData as UserSubscription || data as UserSubscription
  }

  return data as UserSubscription
}

export async function checkUsageLimit(userId: string, type: UsageType): Promise<UsageStatus> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    // Default to free plan limits if no subscription found
    return {
      allowed: true,
      used: 0,
      limit: PLAN_LIMITS.free[type === "quiz" ? "quizzes" : type === "flashcard" ? "flashcards" : "tutorMessages"],
      remaining: PLAN_LIMITS.free[type === "quiz" ? "quizzes" : type === "flashcard" ? "flashcards" : "tutorMessages"],
      planType: "free",
      isUnlimited: false,
      percentUsed: 0,
      upgradeRequired: false,
    }
  }

  let used: number
  let limit: number

  switch (type) {
    case "quiz":
      used = subscription.quizzes_used
      limit = subscription.quiz_limit
      break
    case "flashcard":
      used = subscription.flashcards_used
      limit = subscription.flashcard_limit
      break
    case "tutor":
      used = subscription.tutor_messages_used
      limit = subscription.tutor_messages_limit
      break
  }

  const isUnlimited = limit === -1
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - used)
  const allowed = isUnlimited || used < limit
  const percentUsed = isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100))

  return {
    allowed,
    used,
    limit,
    remaining: isUnlimited ? -1 : remaining,
    planType: subscription.plan_type as PlanType,
    isUnlimited,
    percentUsed,
    upgradeRequired: !allowed,
  }
}

export async function incrementUsage(userId: string, type: UsageType): Promise<boolean> {
  const supabase = await getSupabaseClient()

  const columnMap = {
    quiz: "quizzes_used",
    flashcard: "flashcards_used",
    tutor: "tutor_messages_used",
  }

  const column = columnMap[type]

  // First check if allowed
  const status = await checkUsageLimit(userId, type)
  if (!status.allowed) {
    return false
  }

  const { error } = await supabase.rpc("increment_usage", {
    p_user_id: userId,
    p_column: column,
  })

  // If RPC doesn't exist, fall back to direct update
  if (error) {
    const subscription = await getUserSubscription(userId)
    if (!subscription) return false

    const currentValue = type === "quiz" 
      ? subscription.quizzes_used 
      : type === "flashcard" 
        ? subscription.flashcards_used 
        : subscription.tutor_messages_used

    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({ 
        [column]: currentValue + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)

    if (updateError) {
      console.error("[v0] Error incrementing usage:", updateError)
      return false
    }
  }

  return true
}

export async function getUsageSummary(userId: string): Promise<{
  quiz: UsageStatus
  flashcard: UsageStatus
  tutor: UsageStatus
  subscription: UserSubscription | null
  daysUntilReset: number
}> {
  const subscription = await getUserSubscription(userId)
  const quiz = await checkUsageLimit(userId, "quiz")
  const flashcard = await checkUsageLimit(userId, "flashcard")
  const tutor = await checkUsageLimit(userId, "tutor")

  let daysUntilReset = 30
  if (subscription?.usage_reset_date) {
    const resetDate = new Date(subscription.usage_reset_date)
    const now = new Date()
    daysUntilReset = Math.max(0, Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  }

  return {
    quiz,
    flashcard,
    tutor,
    subscription,
    daysUntilReset,
  }
}
