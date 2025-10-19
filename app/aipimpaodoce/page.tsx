"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProducts } from "@/lib/products-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Tags, Settings, ArrowLeft, Tag, Star, FileText, Percent, LogOut } from "lucide-react"
import Link from "next/link"
import { ProductFormDialog } from "@/components/admin/product-form-dialog"
import { ProductListItem } from "@/components/admin/product-list-item"
import { CategoryManager } from "@/components/admin/category-manager"
import { SettingsPanel } from "@/components/admin/settings-panel"
import { CouponManager } from "@/components/admin/coupon-manager"
import { BadgesManager } from "@/components/admin/badges-manager"
import { ProductPageSettings } from "@/components/admin/product-page-settings"
import { PromotionsManager } from "@/components/admin/promotions-manager"
import { isAuthenticated, logout } from "@/lib/admin-auth"
import type { Product } from "@/lib/products-context"

export default function AdminPage() {
  const router = useRouter()
  const { products, categories, coupons } = useProducts()
  const [activeTab, setActiveTab] = useState("products")
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/aipimpaodoce/login")
    } else {
      setIsChecking(false)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/aipimpaodoce/login")
  }

  const handleAddProduct = () => {
    setEditingProduct(undefined)
    setProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductDialogOpen(true)
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Loja
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-primary">
                <span className="font-mono text-sm font-bold text-primary-foreground">DS</span>
              </div>
              <span className="font-mono text-lg font-bold text-primary text-glow-primary">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{products.length} produtos</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{categories.length} categorias</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{coupons.length} cupons</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 lg:w-auto">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tags className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="coupons" className="gap-2">
              <Tag className="h-4 w-4" />
              Cupons
            </TabsTrigger>
            <TabsTrigger value="promotions" className="gap-2">
              <Percent className="h-4 w-4" />
              Promoção
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Star className="h-4 w-4" />
              Selos
            </TabsTrigger>
            <TabsTrigger value="product-page" className="gap-2">
              <FileText className="h-4 w-4" />
              Página
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Gerenciar Produtos</h2>
              <Button
                onClick={handleAddProduct}
                className="gap-2 bg-primary text-primary-foreground glow-primary hover:bg-primary/90"
              >
                <Package className="h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductListItem key={product.id} product={product} onEdit={handleEditProduct} />
                ))
              ) : (
                <Card className="p-8 text-center border-border/50 bg-card">
                  <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                  <Button onClick={handleAddProduct} className="mt-4 gap-2">
                    <Package className="h-4 w-4" />
                    Adicionar Primeiro Produto
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Gerenciar Categorias</h2>
            <CategoryManager />
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            <CouponManager />
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <PromotionsManager />
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Selos de Destaque</h2>
            <BadgesManager />
          </TabsContent>

          <TabsContent value="product-page" className="space-y-4">
            <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Página de Produto</h2>
            <ProductPageSettings />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Configurações</h2>
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>

      <ProductFormDialog open={productDialogOpen} onOpenChange={setProductDialogOpen} product={editingProduct} />
    </div>
  )
}
