"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Percent } from "lucide-react"
import { useProducts } from "@/lib/products-context"
import { usePromotions, type Promotion } from "@/lib/promotions-context"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

export function PromotionsManager() {
  const { products } = useProducts()
  const { promotions, addPromotion, updatePromotion, deletePromotion, getPromotionByProductId } = usePromotions()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    productId: "",
    active: true,
    discountPercentage: 10,
    badgeText: "OFF",
    badgeColor: "#ef4444",
    badgeTextColor: "#ffffff",
    badgeStyle: "default" as "default" | "rounded" | "sharp" | "glow",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPromotion) {
      await updatePromotion(editingPromotion.id, formData)
    } else {
      await addPromotion(formData)
    }

    setDialogOpen(false)
    setEditingPromotion(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      productId: "",
      active: true,
      discountPercentage: 10,
      badgeText: "OFF",
      badgeColor: "#ef4444",
      badgeTextColor: "#ffffff",
      badgeStyle: "default",
      startDate: "",
      endDate: "",
    })
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      productId: promotion.productId,
      active: promotion.active,
      discountPercentage: promotion.discountPercentage,
      badgeText: promotion.badgeText,
      badgeColor: promotion.badgeColor,
      badgeTextColor: promotion.badgeTextColor,
      badgeStyle: promotion.badgeStyle,
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().slice(0, 16) : "",
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().slice(0, 16) : "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta promoção?")) {
      await deletePromotion(id)
    }
  }

  const handleAddNew = () => {
    setEditingPromotion(null)
    resetForm()
    setDialogOpen(true)
  }

  const getProductById = (id: string) => products.find((p) => p.id === id)

  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    return originalPrice * (1 - discountPercentage / 100)
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Gerenciar Promoções</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Personalize selos de desconto e ative promoções para cada produto
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 bg-primary text-primary-foreground glow-primary">
          <Plus className="h-4 w-4" />
          Nova Promoção
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promotion) => {
          const product = getProductById(promotion.productId)
          if (!product) return null

          const discountedPrice = calculateDiscountedPrice(product.originalPrice, promotion.discountPercentage)

          return (
            <Card key={promotion.id} className="p-4 border-border/50 bg-card">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-border/50">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {promotion.active && (
                      <div
                        className={`absolute top-1 right-1 px-2 py-0.5 text-xs font-bold ${getBadgeStyleClass(promotion.badgeStyle)}`}
                        style={{
                          backgroundColor: promotion.badgeColor,
                          color: promotion.badgeTextColor,
                          boxShadow: promotion.badgeStyle === "glow" ? `0 0 10px ${promotion.badgeColor}80` : "none",
                        }}
                      >
                        {promotion.discountPercentage}% {promotion.badgeText}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={promotion.active ? "default" : "secondary"} className="text-xs">
                        {promotion.active ? "Ativa" : "Inativa"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{promotion.discountPercentage}% OFF</span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs text-muted-foreground line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm font-bold text-primary">R$ {discountedPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Button onClick={() => handleEdit(promotion)} variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(promotion.id)}
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}

        {promotions.length === 0 && (
          <Card className="col-span-full p-8 text-center border-border/50 bg-card">
            <Percent className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Nenhuma promoção cadastrada ainda.</p>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeira Promoção
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-primary text-glow-primary">
              {editingPromotion ? "Editar Promoção" : "Nova Promoção"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Produto</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({ ...formData, productId: value })}
                disabled={!!editingPromotion}
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => {
                    const hasPromotion = getPromotionByProductId(product.id)
                    const isCurrentProduct = editingPromotion?.productId === product.id

                    return (
                      <SelectItem key={product.id} value={product.id} disabled={hasPromotion && !isCurrentProduct}>
                        {product.title} {hasPromotion && !isCurrentProduct && "(já tem promoção)"}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {formData.productId && (
                <p className="text-xs text-muted-foreground">
                  Preço original: R$ {products.find((p) => p.id === formData.productId)?.originalPrice.toFixed(2)}
                  {formData.discountPercentage > 0 && (
                    <>
                      {" "}
                      → Preço com desconto: R${" "}
                      {calculateDiscountedPrice(
                        products.find((p) => p.id === formData.productId)?.originalPrice || 0,
                        formData.discountPercentage,
                      ).toFixed(2)}
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
              />
              <label htmlFor="active" className="text-sm cursor-pointer">
                Promoção Ativa
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Desconto (%)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: Number.parseInt(e.target.value) })}
                  required
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeText">Texto do Selo</Label>
                <Input
                  id="badgeText"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="OFF"
                  maxLength={10}
                  required
                  className="bg-background border-border/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badgeColor">Cor de Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    id="badgeColor"
                    type="color"
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                    className="w-20 h-10 bg-background border-border/50"
                  />
                  <Input
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                    placeholder="#ef4444"
                    className="flex-1 bg-background border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeTextColor">Cor do Texto</Label>
                <div className="flex gap-2">
                  <Input
                    id="badgeTextColor"
                    type="color"
                    value={formData.badgeTextColor}
                    onChange={(e) => setFormData({ ...formData, badgeTextColor: e.target.value })}
                    className="w-20 h-10 bg-background border-border/50"
                  />
                  <Input
                    value={formData.badgeTextColor}
                    onChange={(e) => setFormData({ ...formData, badgeTextColor: e.target.value })}
                    placeholder="#ffffff"
                    className="flex-1 bg-background border-border/50"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeStyle">Estilo do Selo</Label>
              <Select
                value={formData.badgeStyle}
                onValueChange={(value: "default" | "rounded" | "sharp" | "glow") =>
                  setFormData({ ...formData, badgeStyle: value })
                }
              >
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão (bordas arredondadas)</SelectItem>
                  <SelectItem value="rounded">Arredondado (circular)</SelectItem>
                  <SelectItem value="sharp">Reto (sem bordas)</SelectItem>
                  <SelectItem value="glow">Com Brilho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pré-visualização do Selo</Label>
              <div className="p-4 rounded-lg border border-border/50 bg-background flex items-center justify-center">
                <div
                  className={`px-3 py-1.5 text-sm font-bold ${getBadgeStyleClass(formData.badgeStyle)}`}
                  style={{
                    backgroundColor: formData.badgeColor,
                    color: formData.badgeTextColor,
                    boxShadow: formData.badgeStyle === "glow" ? `0 0 10px ${formData.badgeColor}80` : "none",
                  }}
                >
                  {formData.discountPercentage}% {formData.badgeText}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início (opcional)</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Término (opcional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-background border-border/50"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground glow-primary">
                {editingPromotion ? "Salvar Alterações" : "Criar Promoção"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
