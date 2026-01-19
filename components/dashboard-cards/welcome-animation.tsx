"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface WelcomeAnimationProps {
  studentName: string
  isNewUser?: boolean
  onComplete?: () => void
}

export function WelcomeAnimation({ studentName, isNewUser = false, onComplete }: WelcomeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [shouldShow, setShouldShow] = useState(isNewUser)

  useEffect(() => {
    if (!shouldShow || !containerRef.current || !textRef.current) return

    // Animate in
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.75)" },
    )

    // Animate text
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" },
    )

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          setShouldShow(false)
          onComplete?.()
        },
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [shouldShow, onComplete])

  if (!shouldShow) return null

  return (
    <div ref={containerRef} className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="max-w-md w-full mx-auto px-6">
        <div ref={textRef} className="border border-accent bg-accent/5 p-8 backdrop-blur-sm text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">Welcome</p>
          <h1 className="font-[var(--font-bebas)] text-4xl md:text-5xl tracking-wide text-accent mb-2">
            {studentName}
          </h1>
          <p className="font-mono text-xs text-muted-foreground">Your AI learning journey begins here</p>
        </div>
      </div>
    </div>
  )
}
