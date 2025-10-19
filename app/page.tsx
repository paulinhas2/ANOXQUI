"use client"

import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { ProductCard } from "@/components/product-card"
import { useState, useMemo } from "react"
import { useProducts } from "@/lib/products-context"
import Image from "next/image"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const { products } = useProducts()

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((product) => product.categories.includes(selectedCategory))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.categories.some((cat) => cat.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [searchQuery, selectedCategory, products])

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-card via-card to-muted p-8 md:p-12 glow-primary">
          <div className="relative z-10 space-y-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-balance">
              <span className="text-foreground">
                Clique na foto ou no título do Produto para obter mais informações do Produto
              </span>{" "}
              <span className="text-primary text-glow-primary">GANHE DESCONTO</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold">
              <span className="text-foreground">USE O CUPOM:</span>{" "}
              <span className="text-destructive text-glow-primary">VISITANTE</span>
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        </div>

        {/* Category Filter */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-mono text-primary text-glow-primary">Categorias</h2>
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-xl text-muted-foreground">
              {searchQuery
                ? `Nenhum produto encontrado para "${searchQuery}"`
                : `Nenhum produto encontrado na categoria "${selectedCategory}"`}
            </p>
            <div className="flex gap-4">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:text-primary/80 underline font-medium"
                >
                  Limpar busca
                </button>
              )}
              {selectedCategory !== "Todos" && (
                <button
                  onClick={() => setSelectedCategory("Todos")}
                  className="text-primary hover:text-primary/80 underline font-medium"
                >
                  Ver todos
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {/* Logo - AJUSTE O TAMANHO AQUI: Altere h-32 e w-80 para aumentar/diminuir a logo do rodapé */}
            <div className="relative h-32 w-80">
              <Image src="/logo-anox-white.png" alt="ANOX MARKETPLACE" fill className="object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ANOX MARKETPLACE. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
