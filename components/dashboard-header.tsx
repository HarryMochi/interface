"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const getUserName = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) {
        setUserName(user.email.split("@")[0])
      }
    }
    getUserName()
  }, [])

  return (
    <div className="border-b border-border bg-card p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Today's Focus</p>
          <h2 className="font-[var(--font-bebas)] text-2xl tracking-wide mt-1">Ready to Learn?</h2>
        </div>
        <div className="hidden md:block border border-border px-4 py-2 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Last Active</p>
          <p className="font-mono text-xs text-foreground mt-1">Today at 2:30 PM</p>
        </div>
      </div>
    </div>
  )
}
