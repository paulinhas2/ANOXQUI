"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface Promotion {
  id: string
  productId: string
  active: boolean
  discountPercentage: number
  badgeText: string
  badgeColor: string
  badgeTextColor: string
  badgeStyle: "default" | "rounded" | "sharp" | "glow"
  startDate?: string
  endDate?: string
}

interface PromotionsContextType {
  promotions: Promotion[]
  isLoading: boolean
  getPromotionByProductId: (productId: string) => Promotion | undefined
  addPromotion: (promotion: Omit<Promotion, "id">) => Promise<void>
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>
  deletePromotion: (id: string) => Promise<void>
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined)

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    async function loadPromotions() {
      try {
        const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("[v0] Error loading promotions:", error)
        } else if (data) {
          const transformedPromotions = data.map((p) => ({
            id: p.id,
            productId: p.product_id,
            active: p.active,
            discountPercentage: p.discount_percentage,
            badgeText: p.badge_text,
            badgeColor: p.badge_color,
            badgeTextColor: p.badge_text_color,
            badgeStyle: p.badge_style,
            startDate: p.start_date,
            endDate: p.end_date,
          }))
          setPromotions(transformedPromotions)
        }
      } catch (error) {
        console.error("[v0] Error in loadPromotions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPromotions()

    // Set up real-time subscription
    channel = supabase
      .channel("promotions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "promotions" }, (payload) => {
        console.log("[v0] Promotions change detected:", payload)

        if (payload.eventType === "INSERT") {
          const newPromotion = payload.new as any
          setPromotions((prev) => [
            {
              id: newPromotion.id,
              productId: newPromotion.product_id,
              active: newPromotion.active,
              discountPercentage: newPromotion.discount_percentage,
              badgeText: newPromotion.badge_text,
              badgeColor: newPromotion.badge_color,
              badgeTextColor: newPromotion.badge_text_color,
              badgeStyle: newPromotion.badge_style,
              startDate: newPromotion.start_date,
              endDate: newPromotion.end_date,
            },
            ...prev,
          ])
        } else if (payload.eventType === "UPDATE") {
          const updatedPromotion = payload.new as any
          setPromotions((prev) =>
            prev.map((p) =>
              p.id === updatedPromotion.id
                ? {
                    id: updatedPromotion.id,
                    productId: updatedPromotion.product_id,
                    active: updatedPromotion.active,
                    discountPercentage: updatedPromotion.discount_percentage,
                    badgeText: updatedPromotion.badge_text,
                    badgeColor: updatedPromotion.badge_color,
                    badgeTextColor: updatedPromotion.badge_text_color,
                    badgeStyle: updatedPromotion.badge_style,
                    startDate: updatedPromotion.start_date,
                    endDate: updatedPromotion.end_date,
                  }
                : p,
            ),
          )
        } else if (payload.eventType === "DELETE") {
          setPromotions((prev) => prev.filter((p) => p.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getPromotionByProductId = (productId: string) => {
    const promotion = promotions.find((p) => p.productId === productId && p.active)

    // Check if promotion has expired
    if (promotion?.endDate && new Date(promotion.endDate) < new Date()) {
      return undefined
    }

    return promotion
  }

  const addPromotion = async (promotion: Omit<Promotion, "id">) => {
    try {
      console.log("[v0] Adding promotion:", promotion)

      if (!promotion.productId) {
        alert("Por favor, selecione um produto")
        return
      }

      const insertData = {
        product_id: promotion.productId,
        active: promotion.active,
        discount_percentage: promotion.discountPercentage,
        badge_text: promotion.badgeText,
        badge_color: promotion.badgeColor,
        badge_text_color: promotion.badgeTextColor,
        badge_style: promotion.badgeStyle,
        start_date: promotion.startDate || null,
        end_date: promotion.endDate || null,
      }

      console.log("[v0] Insert data:", insertData)

      const { data, error } = await supabase.from("promotions").insert(insertData).select()

      if (error) {
        console.error("[v0] Error adding promotion:", error)
        alert(`Erro ao criar promoção: ${error.message}`)
        throw error
      }

      console.log("[v0] Promotion added successfully:", data)
    } catch (error) {
      console.error("[v0] Error in addPromotion:", error)
      throw error
    }
  }

  const updatePromotion = async (id: string, updatedPromotion: Partial<Promotion>) => {
    try {
      console.log("[v0] Updating promotion with ID:", id)
      console.log("[v0] Update data:", updatedPromotion)

      const updateData: any = {}
      if (updatedPromotion.productId !== undefined) updateData.product_id = updatedPromotion.productId
      if (updatedPromotion.active !== undefined) updateData.active = updatedPromotion.active
      if (updatedPromotion.discountPercentage !== undefined)
        updateData.discount_percentage = updatedPromotion.discountPercentage
      if (updatedPromotion.badgeText !== undefined) updateData.badge_text = updatedPromotion.badgeText
      if (updatedPromotion.badgeColor !== undefined) updateData.badge_color = updatedPromotion.badgeColor
      if (updatedPromotion.badgeTextColor !== undefined) updateData.badge_text_color = updatedPromotion.badgeTextColor
      if (updatedPromotion.badgeStyle !== undefined) updateData.badge_style = updatedPromotion.badgeStyle
      if (updatedPromotion.startDate !== undefined) updateData.start_date = updatedPromotion.startDate || null
      if (updatedPromotion.endDate !== undefined) updateData.end_date = updatedPromotion.endDate || null

      const { data, error } = await supabase.from("promotions").update(updateData).eq("id", id).select()

      if (error) {
        console.error("[v0] Error updating promotion:", error)
        alert(`Erro ao atualizar promoção: ${error.message}`)
        throw error
      }

      console.log("[v0] Promotion updated successfully:", data)
    } catch (error) {
      console.error("[v0] Error in updatePromotion:", error)
      throw error
    }
  }

  const deletePromotion = async (id: string) => {
    try {
      const { error } = await supabase.from("promotions").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting promotion:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in deletePromotion:", error)
      throw error
    }
  }

  return (
    <PromotionsContext.Provider
      value={{
        promotions,
        isLoading,
        getPromotionByProductId,
        addPromotion,
        updatePromotion,
        deletePromotion,
      }}
    >
      {children}
    </PromotionsContext.Provider>
  )
}

export function usePromotions() {
  const context = useContext(PromotionsContext)
  if (context === undefined) {
    throw new Error("usePromotions must be used within a PromotionsProvider")
  }
  return context
}
