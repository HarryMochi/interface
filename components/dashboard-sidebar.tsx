"use client"

import type { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AnimatedNoise } from "@/components/animated-noise"

const navigationItems = [
  { label: "Dashboard", href: "/protected", icon: "▦" },
  { label: "Subjects", href: "/protected/subjects", icon: "◉" },
  { label: "AI Tutor", href: "/protected/tutor", icon: "◆" },
  { label: "Practice & Quizzes", href: "/protected/quizzes", icon: "▢" },
  { label: "Flashcards", href: "/protected/flashcards", icon: "▭" },
  { label: "Study Plans", href: "/protected/study-plans", icon: "▯" },
  { label: "Progress & Analytics", href: "/protected/analytics", icon: "▲" },
  { label: "Performance", href: "/protected/performance", icon: "◈" },
  { label: "Saved Content", href: "/protected/saved", icon: "★" },
]

const resultsItems = [
  { label: "Quiz Results", href: "/protected/quiz-results", icon: "📊" },
  { label: "Flashcard Progress", href: "/protected/flashcard-results", icon: "📈" },
]

interface UsageData {
  quiz: { used: number; limit: number; remaining: number };
  flashcard: { used: number; limit: number; remaining: number };
  planType: string;
}

export function DashboardSidebar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch("/api/usage")
        if (response.ok) {
          const data = await response.json()
          setUsage(data)
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error)
      }
    }
    fetchUsage()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <aside
      className="w-64 border-r border-border flex flex-col bg-sidebar"
      role="navigation"
      aria-label="Main navigation"
    >
      <AnimatedNoise opacity={0.02} />

      {/* Logo/Branding */}
      <div className="p-6 border-b border-border">
        <Link
          href="/"
          className="block font-[var(--font-bebas)] text-xl tracking-wide hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="INTERFACE - Learning Platform"
        >
          INTERFACE
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-2">Learning Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                isActive
                  ? "border-l-2 border-accent text-accent bg-sidebar-accent"
                  : "text-sidebar-foreground hover:text-accent border-l-2 border-transparent hover:border-accent/50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-lg opacity-60" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        <div className="my-4 border-t border-sidebar-border" />

        <p className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Results</p>

        {resultsItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                isActive
                  ? "border-l-2 border-accent text-accent bg-sidebar-accent"
                  : "text-sidebar-foreground hover:text-accent border-l-2 border-transparent hover:border-accent/50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-lg opacity-60" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Usage Display */}
      {usage && usage.planType === "free" && (
        <div className="border-t border-border p-4 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Usage This Month</p>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-sidebar-foreground">Quizzes</span>
              <span className={`font-mono text-xs ${usage.quiz.remaining === 0 ? 'text-red-500' : 'text-accent'}`}>
                {usage.quiz.used}/{usage.quiz.limit}
              </span>
            </div>
            <div className="w-full h-1 bg-sidebar-border rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${usage.quiz.remaining === 0 ? 'bg-red-500' : 'bg-accent'}`}
                style={{ width: `${Math.min((usage.quiz.used / usage.quiz.limit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] text-sidebar-foreground">Flashcards</span>
              <span className={`font-mono text-xs ${usage.flashcard.remaining === 0 ? 'text-red-500' : 'text-accent'}`}>
                {usage.flashcard.used}/{usage.flashcard.limit}
              </span>
            </div>
            <div className="w-full h-1 bg-sidebar-border rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${usage.flashcard.remaining === 0 ? 'bg-red-500' : 'bg-accent'}`}
                style={{ width: `${Math.min((usage.flashcard.used / usage.flashcard.limit) * 100, 100)}%` }}
              />
            </div>
          </div>

          <Link
            href="/protected/upgrade"
            className="block w-full text-center px-4 py-2 bg-accent text-background font-mono text-xs uppercase tracking-widest hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      {/* User info and logout */}
      <div className="border-t border-border p-4 space-y-4">
        <div className="px-4 py-3 border border-sidebar-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Account</p>
          <p className="font-mono text-xs text-sidebar-foreground mt-1 truncate" title={user.email}>
            {user.email}
          </p>
          {usage && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent mt-1">
              {usage.planType === "free" ? "Free Plan" : "Premium"}
            </p>
          )}
        </div>

        <Link
          href="/protected/settings"
          className="block w-full text-center px-4 py-2 border border-sidebar-border font-mono text-xs uppercase tracking-widest text-sidebar-foreground hover:border-accent hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          aria-label="Open settings"
        >
          Settings
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-4 py-2 border border-sidebar-border font-mono text-xs uppercase tracking-widest text-sidebar-foreground hover:border-accent hover:text-accent disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          aria-busy={isLoggingOut}
        >
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </button>
      </div>
    </aside>
  )
}
