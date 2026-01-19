"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { LoadingSpinner } from "@/components/loading-spinner"

interface UserPreferences {
  notifications_enabled: boolean
  dark_mode: boolean
  save_history: boolean
  difficulty_level: "beginner" | "intermediate" | "advanced"
  daily_goal_minutes: number
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications_enabled: true,
    dark_mode: true,
    save_history: true,
    difficulty_level: "intermediate",
    daily_goal_minutes: 30,
  })

  const supabase = createClient()

  useEffect(() => {
    loadPreferences()
  }, [])

  async function loadPreferences() {
    try {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      if (data) {
        setPreferences({
          notifications_enabled: data.notification_enabled ?? true,
          dark_mode: data.dark_mode ?? true,
          save_history: data.save_history ?? true,
          difficulty_level: data.difficulty_level ?? "intermediate",
          daily_goal_minutes: data.daily_goal_minutes ?? 30,
        })
      }
    } catch (err) {
      console.error("[v0] Error loading preferences:", err)
      setError("Failed to load preferences")
    } finally {
      setIsLoading(false)
    }
  }

  async function savePreferences() {
    try {
      setIsSaving(true)
      setError(null)
      setSuccess(false)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        notification_enabled: preferences.notifications_enabled,
        dark_mode: preferences.dark_mode,
        save_history: preferences.save_history,
        difficulty_level: preferences.difficulty_level,
        daily_goal_minutes: preferences.daily_goal_minutes,
      })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("[v0] Error saving preferences:", err)
      setError("Failed to save preferences")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading settings..." />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border border-border p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Configure</p>
          <h1 className="font-[var(--font-bebas)] text-3xl md:text-4xl tracking-wide mt-2">Settings</h1>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            Manage your account preferences and learning settings.
          </p>
        </div>

        {/* Account Settings */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-6">Account</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <p className="font-mono text-sm">Email</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">Your account email address</p>
              </div>
              <button className="font-mono text-xs uppercase tracking-widest text-accent hover:underline">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <p className="font-mono text-sm">Password</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">Update your password</p>
              </div>
              <button className="font-mono text-xs uppercase tracking-widest text-accent hover:underline">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-6">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <label htmlFor="dark-mode" className="font-mono text-sm cursor-pointer">
                  Dark Mode
                </label>
                <p className="font-mono text-xs text-muted-foreground mt-1">Use dark theme</p>
              </div>
              <button
                id="dark-mode"
                onClick={() => setPreferences({ ...preferences, dark_mode: !preferences.dark_mode })}
                className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                  preferences.dark_mode ? "bg-accent" : "bg-secondary"
                }`}
                role="switch"
                aria-checked={preferences.dark_mode}
                aria-label="Toggle dark mode"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-background transition-transform duration-200 ${
                    preferences.dark_mode ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <label htmlFor="notifications" className="font-mono text-sm cursor-pointer">
                  Notifications
                </label>
                <p className="font-mono text-xs text-muted-foreground mt-1">Receive learning notifications</p>
              </div>
              <button
                id="notifications"
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    notifications_enabled: !preferences.notifications_enabled,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                  preferences.notifications_enabled ? "bg-accent" : "bg-secondary"
                }`}
                role="switch"
                aria-checked={preferences.notifications_enabled}
                aria-label="Toggle notifications"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-background transition-transform duration-200 ${
                    preferences.notifications_enabled ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <label htmlFor="save-history" className="font-mono text-sm cursor-pointer">
                  Save History
                </label>
                <p className="font-mono text-xs text-muted-foreground mt-1">Keep learning history</p>
              </div>
              <button
                id="save-history"
                onClick={() => setPreferences({ ...preferences, save_history: !preferences.save_history })}
                className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                  preferences.save_history ? "bg-accent" : "bg-secondary"
                }`}
                role="switch"
                aria-checked={preferences.save_history}
                aria-label="Toggle save history"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-background transition-transform duration-200 ${
                    preferences.save_history ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Learning Settings */}
        <div className="border border-border p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-6">Learning</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <label htmlFor="difficulty" className="font-mono text-sm">
                  Difficulty Level
                </label>
                <p className="font-mono text-xs text-muted-foreground mt-1">Adjust content complexity</p>
              </div>
              <select
                id="difficulty"
                value={preferences.difficulty_level}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    difficulty_level: e.target.value as "beginner" | "intermediate" | "advanced",
                  })
                }
                className="bg-transparent border border-foreground/20 px-3 py-1 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Select difficulty level"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-foreground/10">
              <div>
                <label htmlFor="daily-goal" className="font-mono text-sm">
                  Daily Goal
                </label>
                <p className="font-mono text-xs text-muted-foreground mt-1">Minutes per day</p>
              </div>
              <select
                id="daily-goal"
                value={preferences.daily_goal_minutes}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    daily_goal_minutes: Number.parseInt(e.target.value),
                  })
                }
                className="bg-transparent border border-foreground/20 px-3 py-1 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Select daily goal in minutes"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-500/30 p-6 md:p-8">
          <h3 className="font-[var(--font-bebas)] text-xl tracking-wide mb-4 text-red-500">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm">Delete Account</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">Permanently delete your account and data</p>
            </div>
            <button className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors duration-200">
              Delete
            </button>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="border border-destructive bg-destructive/10 p-4">
            <p className="font-mono text-sm text-destructive" role="alert">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="border border-accent bg-accent/10 p-4">
            <p className="font-mono text-sm text-accent" role="status">
              Settings saved successfully
            </p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="flex-1 px-6 py-3 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent/10 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
            aria-busy={isSaving}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  )
}
