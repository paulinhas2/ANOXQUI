"use client"

import type React from "react"

import { useState } from "react"
import { useProducts, type Coupon } from "@/lib/products-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Tag, Trash2, Edit, Plus, Percent, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export function CouponManager() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useProducts()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    expiryDate: "",
    usageLimit: undefined as number | undefined,
    active: true,
  })

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expiryDate: "",
      usageLimit: undefined,
      active: true,
    })
    setEditingCoupon(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, formData)
    } else {
      addCoupon(formData)
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiryDate: coupon.expiryDate || "",
      usageLimit: coupon.usageLimit,
      active: coupon.active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cupom?")) {
      deleteCoupon(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary font-mono">Gerenciar Cupons</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border/50 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary font-mono">
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Cupom</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: DESCONTO10"
                  required
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Tipo de Desconto</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: "percentage" | "fixed") => setFormData({ ...formData, discountType: value })}
                >
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valor do Desconto {formData.discountType === "percentage" ? "(%)" : "(R$)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number.parseFloat(e.target.value) })}
                  required
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Data de Expiração (Opcional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="bg-background border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Limite de Uso (Opcional)</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  placeholder="Ilimitado"
                  className="bg-background border-border/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="active">Cupom Ativo</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              >
                {editingCoupon ? "Atualizar Cupom" : "Criar Cupom"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {coupons.length === 0 ? (
          <Card className="p-8 text-center border-border/50 bg-background">
            <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum cupom cadastrado</p>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card
              key={coupon.id}
              className="p-4 border-border/50 bg-background hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      {coupon.discountType === "percentage" ? (
                        <Percent className="h-5 w-5 text-primary" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono text-primary">{coupon.code}</h3>
                      <p className="text-sm text-muted-foreground">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}% de desconto`
                          : `R$ ${coupon.discountValue.toFixed(2)} de desconto`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {coupon.expiryDate && (
                      <span className="px-2 py-1 rounded bg-muted">
                        Expira: {new Date(coupon.expiryDate).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    {coupon.usageLimit && (
                      <span className="px-2 py-1 rounded bg-muted">
                        Usos: {coupon.usedCount}/{coupon.usageLimit}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded ${
                        coupon.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {coupon.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(coupon)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(coupon.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
