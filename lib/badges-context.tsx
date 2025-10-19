"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface Badge {
  id: string
  name: string
  emoji: string
  color: string
}

interface BadgesContextType {
  badges: Badge[]
  isLoading: boolean
  getBadgeById: (id: string) => Badge | undefined
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined)

export function BadgesProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    async function loadBadges() {
      try {
        const { data, error } = await supabase.from("featured_badges").select("*").order("created_at")

        if (error) {
          console.error("[v0] Error loading badges:", error)
        } else if (data) {
          setBadges(data)
        }
      } catch (error) {
        console.error("[v0] Error in loadBadges:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBadges()

    // Set up real-time subscription
    channel = supabase
      .channel("badges-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "featured_badges" }, (payload) => {
        console.log("[v0] Badges change detected:", payload)

        if (payload.eventType === "INSERT") {
          setBadges((prev) => [...prev, payload.new as Badge])
        } else if (payload.eventType === "UPDATE") {
          setBadges((prev) => prev.map((b) => (b.id === payload.new.id ? (payload.new as Badge) : b)))
        } else if (payload.eventType === "DELETE") {
          setBadges((prev) => prev.filter((b) => b.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getBadgeById = (id: string) => {
    return badges.find((b) => b.id === id)
  }

  return <BadgesContext.Provider value={{ badges, isLoading, getBadgeById }}>{children}</BadgesContext.Provider>
}

export function useBadges() {
  const context = useContext(BadgesContext)
  if (context === undefined) {
    throw new Error("useBadges must be used within a BadgesProvider")
  }
  return context
}
