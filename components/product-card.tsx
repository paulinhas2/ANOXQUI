"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Zap } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useBadges } from "@/lib/badges-context"
import { usePromotions } from "@/lib/promotions-context"
import { useState } from "react"

interface ProductCardProps {
  id: string
  title: string
  image: string
  originalPrice: number
  price: number
  categories: string[]
  featured?: boolean
  badgeId?: string
}

export function ProductCard({
  id,
  title,
  image,
  originalPrice,
  price,
  categories,
  featured = false,
  badgeId,
}: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const { getBadgeById } = useBadges()
  const badge = badgeId ? getBadgeById(badgeId) : null
  const { getPromotionByProductId } = usePromotions()
  const promotion = getPromotionByProductId(id)
  const [isAdding, setIsAdding] = useState(false)

  const finalPrice =
    promotion && promotion.active ? originalPrice * (1 - promotion.discountPercentage / 100) : originalPrice

  const discount = promotion && promotion.active ? promotion.discountPercentage : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    addItem({ id, title, image, price: finalPrice })
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, title, image, price: finalPrice })
    openCart()
  }

  const getBadgeStyleClass = (style: string) => {
    switch (style) {
      case "rounded":
        return "rounded-full"
      case "sharp":
        return "rounded-none"
      case "glow":
        return "rounded-md shadow-lg"
      default:
        return "rounded-md"
    }
  }

  return (
    <Link href={`/produto/${id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:border-primary hover:glow-primary">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {featured && badge && (
            <Badge
              className="absolute left-2 top-2 text-secondary-foreground flex items-center gap-1"
              style={{
                backgroundColor: badge.color,
                boxShadow: `0 0 10px ${badge.color}80`,
              }}
            >
              <span className="text-base leading-none">{badge.emoji}</span>
              <span>{badge.name}</span>
            </Badge>
          )}
          {promotion && promotion.active ? (
            <div
              className={`absolute right-2 top-2 px-2 py-1 text-xs font-bold ${getBadgeStyleClass(promotion.badgeStyle)}`}
              style={{
                backgroundColor: promotion.badgeColor,
                color: promotion.badgeTextColor,
                boxShadow: promotion.badgeStyle === "glow" ? `0 0 10px ${promotion.badgeColor}80` : "none",
              }}
            >
              {promotion.discountPercentage}% {promotion.badgeText}
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                {category}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {discount > 0 && (
                  <p className="text-xs text-muted-foreground line-through">R$ {originalPrice.toFixed(2)}</p>
                )}
                <p className="text-xl font-bold text-primary text-glow-primary">R$ {finalPrice.toFixed(2)}</p>
              </div>

              <Button
                size="icon"
                className={`bg-primary text-primary-foreground hover:bg-primary/90 glow-primary transition-all ${
                  isAdding ? "scale-110" : ""
                }`}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-secondary font-semibold"
              onClick={handleBuyNow}
            >
              <Zap className="h-4 w-4 mr-2" />
              Comprar Agora
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
