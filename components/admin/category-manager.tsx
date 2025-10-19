"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/products-context"
import { Plus, Trash2, Tag } from "lucide-react"

export function CategoryManager() {
  const { categories, addCategory, deleteCategory } = useProducts()
  const [newCategory, setNewCategory] = useState("")

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (newCategory.trim()) {
      addCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category}"? Ela será removida de todos os produtos.`)) {
      deleteCategory(category)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-border/50 bg-card">
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nome da nova categoria"
            className="bg-background border-border/50"
          />
          <Button type="submit" className="gap-2 bg-primary text-primary-foreground glow-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category} className="p-4 border-border/50 bg-card hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-medium">{category}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCategory(category)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-8 text-center border-border/50 bg-card">
            <p className="text-muted-foreground">Nenhuma categoria cadastrada ainda.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
