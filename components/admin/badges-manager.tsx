"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Badge {
  id: string
  name: string
  emoji: string
  color: string
}

export function BadgesManager() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null)
  const [formData, setFormData] = useState({ name: "", emoji: "⭐", color: "#10b981" })
  const supabase = createClient()

  useEffect(() => {
    loadBadges()

    const channel = supabase
      .channel("badges-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "featured_badges" }, () => {
        loadBadges()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadBadges = async () => {
    const { data, error } = await supabase.from("featured_badges").select("*").order("created_at")

    if (error) {
      console.error("[v0] Error loading badges:", error)
    } else if (data) {
      setBadges(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingBadge) {
      const { error } = await supabase
        .from("featured_badges")
        .update({ name: formData.name, emoji: formData.emoji, color: formData.color })
        .eq("id", editingBadge.id)

      if (error) console.error("[v0] Error updating badge:", error)
    } else {
      const { error } = await supabase.from("featured_badges").insert(formData)

      if (error) console.error("[v0] Error adding badge:", error)
    }

    setDialogOpen(false)
    setEditingBadge(null)
    setFormData({ name: "", emoji: "⭐", color: "#10b981" })
  }

  const handleEdit = (badge: Badge) => {
    setEditingBadge(badge)
    setFormData({ name: badge.name, emoji: badge.emoji, color: badge.color })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este selo?")) {
      const { error } = await supabase.from("featured_badges").delete().eq("id", id)

      if (error) console.error("[v0] Error deleting badge:", error)
    }
  }

  const handleAddNew = () => {
    setEditingBadge(null)
    setFormData({ name: "", emoji: "⭐", color: "#10b981" })
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gerencie os selos de destaque que podem ser aplicados aos produtos.
        </p>
        <Button onClick={handleAddNew} className="gap-2 bg-primary text-primary-foreground glow-primary">
          <Plus className="h-4 w-4" />
          Adicionar Selo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <Card key={badge.id} className="p-4 border-border/50 bg-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="text-3xl flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{ backgroundColor: badge.color + "20" }}
                >
                  {badge.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">Cor: {badge.color}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button onClick={() => handleEdit(badge)} variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDelete(badge.id)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-primary text-glow-primary">
              {editingBadge ? "Editar Selo" : "Adicionar Selo"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Selo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                value={formData.emoji}
                onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                required
                maxLength={2}
                className="bg-background border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor (Hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10 bg-background border-border/50"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#10b981"
                  className="flex-1 bg-background border-border/50"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground glow-primary">
                {editingBadge ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
