"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Shield, Download, Clock, ArrowLeft, Star } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useProducts } from "@/lib/products-context"
import { useBadges } from "@/lib/badges-context"
import { usePromotions } from "@/lib/promotions-context"

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const { products, isLoading } = useProducts()
  const { getBadgeById } = useBadges()
  const { getPromotionByProductId } = usePromotions()
  const product = products.find((p) => p.id === productId)

  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)

  const productBadge = product?.badgeId ? getBadgeById(product.badgeId) : null
  const promotion = product ? getPromotionByProductId(product.id) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando produto...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">Produto não encontrado</h1>
            <Link href="/">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Início
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const finalPrice =
    promotion && promotion.active
      ? product.originalPrice * (1 - promotion.discountPercentage / 100)
      : product.originalPrice

  const discount = promotion && promotion.active ? promotion.discountPercentage : 0

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]

  const handleAddToCart = () => {
    setIsAdding(true)
    addItem({
      id: product.id,
      title: product.title,
      image: product.image,
      price: finalPrice,
    })
    setTimeout(() => setIsAdding(false), 1000)
  }

  const relatedProducts =
    product.relatedProductIds && product.relatedProductIds.length > 0
      ? products.filter((p) => product.relatedProductIds?.includes(p.id))
      : products
          .filter((p) => p.id !== product.id && p.categories.some((cat) => product.categories.includes(cat)))
          .slice(0, 3)

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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 hover:bg-card hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border/50 bg-muted glow-primary">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {promotion && promotion.active ? (
                <div
                  className={`absolute right-4 top-4 px-3 py-1.5 text-sm font-bold ${getBadgeStyleClass(promotion.badgeStyle)}`}
                  style={{
                    backgroundColor: promotion.badgeColor,
                    color: promotion.badgeTextColor,
                    boxShadow: promotion.badgeStyle === "glow" ? `0 0 15px ${promotion.badgeColor}80` : "none",
                  }}
                >
                  {promotion.discountPercentage}% {promotion.badgeText}
                </div>
              ) : null}
              {productBadge && product.featured && (
                <Badge
                  className="absolute left-4 top-4 text-lg px-4 py-2 text-white"
                  style={{
                    backgroundColor: productBadge.color,
                    boxShadow: `0 0 15px ${productBadge.color}80`,
                  }}
                >
                  {productBadge.emoji} {productBadge.name}
                </Badge>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-video overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === idx ? "border-primary glow-primary" : "border-border/50 hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category: string) => (
                  <Badge key={category} variant="outline" className="border-primary/50 text-primary">
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">{product.title}</h1>

              {product.enableReviews && product.customRating != null && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.customRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.customRating.toFixed(1)} ({product.totalReviews || 0} avaliações)
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
              {discount > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Preço original:</p>
                  <p className="text-2xl text-muted-foreground line-through">R$ {product.originalPrice.toFixed(2)}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{discount > 0 ? "Preço promocional:" : "Preço:"}</p>
                <p className="text-5xl font-bold text-primary text-glow-primary">R$ {finalPrice.toFixed(2)}</p>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                >
                  {isAdding ? (
                    "Adicionado!"
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Compra Segura</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                    <Download className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Download Imediato</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-md bg-muted/50">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">Suporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border/50">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Descrição
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Categorias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <p className="text-foreground leading-relaxed text-lg">
                  {product.description || "Sem descrição disponível."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category: string) => (
                    <Badge key={category} variant="outline" className="text-base px-4 py-2">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {relatedProducts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-mono text-primary text-glow-primary">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} {...relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
