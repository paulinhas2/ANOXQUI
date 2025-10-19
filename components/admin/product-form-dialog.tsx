"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useProducts, type Product } from "@/lib/products-context"
import { useBadges } from "@/lib/badges-context"
import { Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { addProduct, updateProduct, categories, products } = useProducts()
  const { badges } = useBadges()

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    images: [] as string[],
    originalPrice: 0,
    categories: [] as string[],
    featured: false,
    badgeId: "" as string,
    description: "",
    pageLayout: "default" as "default" | "minimal" | "detailed",
    enableReviews: true,
    customRating: 4.5,
    totalReviews: 0,
    relatedProductIds: [] as string[],
  })

  useEffect(() => {
    if (product) {
      console.log("[v0] Editing product:", product)
      setFormData({
        title: product.title,
        image: product.image,
        images: product.images || [product.image],
        originalPrice: product.originalPrice,
        categories: Array.isArray(product.categories) ? product.categories : [],
        featured: product.featured || false,
        badgeId: product.badgeId || "",
        description: product.description || "",
        pageLayout: product.pageLayout || "default",
        enableReviews: product.enableReviews !== false,
        customRating: product.customRating || 4.5,
        totalReviews: product.totalReviews || 0,
        relatedProductIds: product.relatedProductIds || [],
      })
    } else {
      setFormData({
        title: "",
        image: "",
        images: [],
        originalPrice: 0,
        categories: [],
        featured: false,
        badgeId: "",
        description: "",
        pageLayout: "default",
        enableReviews: true,
        customRating: 4.5,
        totalReviews: 0,
        relatedProductIds: [],
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Submitting form with data:", formData)

    if (product) {
      await updateProduct(product.id, formData)
    } else {
      await addProduct(formData)
    }
    onOpenChange(false)
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(category)
      console.log("[v0] Toggling category:", category, "Currently selected:", isSelected)

      return {
        ...prev,
        categories: isSelected ? prev.categories.filter((c) => c !== category) : [...prev.categories, category],
      }
    })
  }

  const addImageUrl = () => {
    if (formData.image && !formData.images.includes(formData.image)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, prev.image],
        image: "",
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const toggleRelatedProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      relatedProductIds: prev.relatedProductIds.includes(productId)
        ? prev.relatedProductIds.filter((id) => id !== productId)
        : [...prev.relatedProductIds, productId],
    }))
  }

  const availableProducts = products.filter((p) => p.id !== product?.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-mono text-primary text-glow-primary">
            {product ? "Editar Produto" : "Adicionar Produto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="display">Exibição</TabsTrigger>
              <TabsTrigger value="page">Página</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Produto</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagens do Produto</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/placeholder.svg?height=400&width=600"
                      className="bg-background border-border/50"
                    />
                    <Button type="button" onClick={addImageUrl} variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="space-y-2 p-3 rounded-lg border border-border/50 bg-background">
                      <p className="text-sm text-muted-foreground">Imagens adicionadas ({formData.images.length}):</p>
                      <div className="space-y-1">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="flex-1 truncate">{img}</span>
                            <Button
                              type="button"
                              onClick={() => removeImage(idx)}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number.parseFloat(e.target.value) })}
                  required
                  className="bg-background border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Use a aba "PROMOÇÃO" para aplicar descontos a este produto
                </p>
              </div>

              <div className="space-y-2">
                <Label>Categorias (selecione uma ou mais)</Label>
                <div className="grid grid-cols-2 gap-2 p-4 rounded-lg border border-border/50 bg-background max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.categories.length > 0 && (
                  <p className="text-xs text-muted-foreground">Selecionadas: {formData.categories.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-background border-border/50"
                />
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                />
                <label htmlFor="featured" className="text-sm cursor-pointer">
                  Produto em Destaque
                </label>
              </div>

              {formData.featured && badges.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="badge">Selo de Destaque</Label>
                  <Select
                    value={formData.badgeId}
                    onValueChange={(value) => setFormData({ ...formData, badgeId: value })}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Selecione um selo" />
                    </SelectTrigger>
                    <SelectContent>
                      {badges.map((badge) => (
                        <SelectItem key={badge.id} value={badge.id}>
                          <span className="flex items-center gap-2">
                            {badge.emoji} {badge.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="pageLayout">Layout da Página do Produto</Label>
                <Select
                  value={formData.pageLayout}
                  onValueChange={(value: "default" | "minimal" | "detailed") =>
                    setFormData({ ...formData, pageLayout: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="detailed">Detalhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="page" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Avaliações</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enableReviews"
                    checked={formData.enableReviews}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableReviews: checked as boolean })}
                  />
                  <label htmlFor="enableReviews" className="text-sm cursor-pointer">
                    Exibir Avaliações
                  </label>
                </div>

                {formData.enableReviews && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="customRating">Avaliação (0-5 estrelas)</Label>
                      <Input
                        id="customRating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.customRating}
                        onChange={(e) => setFormData({ ...formData, customRating: Number.parseFloat(e.target.value) })}
                        className="bg-background border-border/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalReviews">Total de Avaliações</Label>
                      <Input
                        id="totalReviews"
                        type="number"
                        min="0"
                        value={formData.totalReviews}
                        onChange={(e) => setFormData({ ...formData, totalReviews: Number.parseInt(e.target.value) })}
                        className="bg-background border-border/50"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-border/50 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Produtos Relacionados</h3>
                <p className="text-xs text-muted-foreground">
                  Selecione os produtos que serão exibidos como relacionados neste produto
                </p>

                <div className="grid grid-cols-1 gap-2 p-4 rounded-lg border border-border/50 bg-background max-h-60 overflow-y-auto">
                  {availableProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum outro produto disponível</p>
                  ) : (
                    availableProducts.map((p) => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`related-${p.id}`}
                          checked={formData.relatedProductIds.includes(p.id)}
                          onCheckedChange={() => toggleRelatedProduct(p.id)}
                        />
                        <label htmlFor={`related-${p.id}`} className="text-sm cursor-pointer flex-1">
                          {p.title}
                        </label>
                      </div>
                    ))
                  )}
                </div>
                {formData.relatedProductIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {formData.relatedProductIds.length} produto(s) selecionado(s)
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground glow-primary hover:bg-primary/90">
              {product ? "Salvar Alterações" : "Adicionar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
