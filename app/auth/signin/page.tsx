"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { AnimatedNoise } from "@/components/animated-noise"
import gsap from "gsap"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [repeatPassword, setRepeatPassword] = useState("")
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !formRef.current) return

    gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
  }, [isSignUp])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        if (password !== repeatPassword) {
          setError("Passwords do not match")
          setIsLoading(false)
          return
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/protected`,
          },
        })

        if (signUpError) {
          console.log("[v0] Signup error:", signUpError.message)
          throw signUpError
        }

        // The user is now created in Supabase and can proceed to profile setup
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/protected/onboarding")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/protected")
      }
    } catch (error: unknown) {
      console.log("[v0] Auth error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError(null)
    setEmail("")
    setPassword("")
    setRepeatPassword("")
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full flex items-center justify-center p-6 md:p-10">
      <AnimatedNoise opacity={0.03} />

      <Link
        href="/"
        className="absolute top-4 md:top-6 right-4 md:right-6 border border-foreground/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
      >
        Back
      </Link>

      {/* Left vertical labels */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          {isSignUp ? "SIGNUP" : "SIGNIN"}
        </span>
      </div>

      <div ref={formRef} className="w-full max-w-md">
        <div className="border border-border p-8 md:p-12 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-wide mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              {isSignUp ? "Join INTERFACE Today" : "Enter Your Credentials"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-foreground/10 px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors duration-200"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 font-mono text-xs text-red-500">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 group inline-flex items-center justify-center gap-2 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ScrambleTextOnHover
                text={isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
                as="span"
                duration={0.6}
              />
              {!isLoading && (
                <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-foreground/10">
            <p className="font-mono text-xs text-muted-foreground text-center mb-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="w-full font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {isSignUp ? "Sign In Instead" : "Create Account"}
            </button>
          </div>
        </div>

        {/* Floating info tag */}
        <div className="mt-8 flex justify-between items-center px-4">
          <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            INTERFACE / Auth
          </div>
        </div>
      </div>
    </div>
  )
}
