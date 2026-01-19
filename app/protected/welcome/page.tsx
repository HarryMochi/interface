"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import gsap from "gsap"

export default function WelcomePage() {
  const [studentName, setStudentName] = useState("")
  const [grade, setGrade] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const welcomeTextRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const handleGoToDashboard = () => {
    router.replace("/protected")
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()

        if (!userData.user) {
          router.push("/auth/signin")
          return
        }

        const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userData.user.id).single()

        if (profile) {
          setStudentName(profile.student_name)
          setGrade(profile.grade)
        }

        setIsLoading(false)

        // Animate welcome text
        if (welcomeTextRef.current) {
          gsap.fromTo(welcomeTextRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8 })
        }

        // Animate profile card
        if (profileRef.current) {
          gsap.fromTo(profileRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
        }

        const timer = setTimeout(() => {
          router.replace("/protected")
        }, 4000)

        return () => clearTimeout(timer)
      } catch (error) {
        console.error("Error fetching profile:", error)
        router.push("/protected")
      }
    }

    fetchProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="font-mono text-sm text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background">
      {/* Animated welcome text */}
      <div ref={welcomeTextRef} className="mb-12 text-center">
        <h1 className="font-[var(--font-bebas)] text-5xl md:text-6xl tracking-wide mb-4">
          Welcome,
          <br />
          <span className="text-accent">{studentName}</span>
        </h1>
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
          Your AI-powered learning journey begins now
        </p>
      </div>

      {/* Profile summary card */}
      <div ref={profileRef} className="max-w-md w-full border border-border p-8">
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Student Profile</p>
            <div className="space-y-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">Name</p>
                <p className="font-[var(--font-bebas)] text-xl tracking-wide">{studentName}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">Grade Level</p>
                <p className="font-[var(--font-bebas)] text-xl tracking-wide">{grade}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-foreground/10 space-y-4">
            <button
              onClick={handleGoToDashboard}
              className="w-full border border-accent px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:bg-accent/5 transition-all"
            >
              Go to Dashboard
            </button>
            <p className="font-mono text-xs text-muted-foreground text-center">
              Redirecting automatically in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
