"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
  className?: string
}

export function LoadingSpinner({ size = "md", message, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className={cn("border-2 border-border border-t-accent rounded-full animate-spin", sizeClasses[size])} />
      {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}
    </div>
  )
}
