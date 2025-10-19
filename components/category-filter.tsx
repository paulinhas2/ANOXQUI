"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"
import { useProducts } from "@/lib/products-context"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { categories } = useProducts()
  const allCategories = ["Todos", ...categories]

  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full justify-between border-border/50 bg-card"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-mono text-sm">{selectedCategory}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
        {isOpen && (
          <div className="mt-2 space-y-2 rounded-lg border border-border/50 bg-card p-4">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category)
                  setIsOpen(false)
                }}
                className={`w-full rounded-md px-4 py-2 text-left text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Horizontal Scroll */}
      <div className="hidden md:block">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
                  : "border-border/50 text-foreground hover:border-primary hover:text-primary"
              }`}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
