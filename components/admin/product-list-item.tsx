"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProducts, type Product } from "@/lib/products-context"
import { useBadges } from "@/lib/badges-context"
import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface ProductListItemProps {
  product: Product
  onEdit: (product: Product) => void
}

export function ProductListItem({ product, onEdit }: ProductListItemProps) {
  const { deleteProduct } = useProducts()
  const { getBadgeById } = useBadges()
  const badge = product.badgeId ? getBadgeById(product.badgeId) : null

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir "${product.title}"?`)) {
      deleteProduct(product.id)
    }
  }

  return (
    <Card className="p-4 border-border/50 bg-card hover:border-primary/50 transition-colors">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-border/50">
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
          {product.featured && badge && (
            <div
              className="absolute top-1 right-1 rounded-full p-1"
              style={{
                backgroundColor: badge.color,
                boxShadow: `0 0 8px ${badge.color}80`,
              }}
            >
              <span className="text-lg leading-none">{badge.emoji}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 truncate">{product.title}</h3>
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs border-border/50">
                {cat}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-bold">R$ {product.originalPrice.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">(Preço Original)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(product)} className="gap-2">
            <Edit className="h-3 w-3" />
            Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete} className="gap-2">
            <Trash2 className="h-3 w-3" />
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  )
}
