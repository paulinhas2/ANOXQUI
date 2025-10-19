"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Trash2, Plus, Minus, Tag, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useProducts } from "@/lib/products-context"
import Image from "next/image"
import { useState } from "react"

export function CartSheet() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isCartOpen,
    setIsCartOpen,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
  } = useCart()
  const { validateCoupon } = useProducts()
  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Digite um código de cupom")
      return
    }

    const coupon = validateCoupon(couponCode)
    if (coupon) {
      applyCoupon(coupon)
      setCouponCode("")
      setCouponError("")
    } else {
      setCouponError("Cupom inválido ou expirado")
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponError("")
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-card hover:text-primary">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground glow-primary">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-card border-border/50">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold font-mono text-primary text-glow-primary">
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground">Seu carrinho está vazio</p>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border/50 bg-background p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-2">{item.title}</h4>
                      <p className="text-lg font-bold text-primary">R$ {item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-border/50 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-border/50 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 border-t border-border/50 pt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Cupom de Desconto
                  </label>

                  {appliedCoupon ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/50 bg-primary/5">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="flex-1 font-mono text-sm text-primary font-bold">{appliedCoupon.code}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite o cupom"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase())
                          setCouponError("")
                        }}
                        className="flex-1 bg-background border-border/50 focus:border-primary"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Aplicar
                      </Button>
                    </div>
                  )}

                  {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">R$ {subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">
                        Desconto (
                        {appliedCoupon.discountType === "percentage"
                          ? `${appliedCoupon.discountValue}%`
                          : `R$ ${appliedCoupon.discountValue}`}
                        ):
                      </span>
                      <span className="text-primary font-bold">- R$ {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border/50">
                    <span className="text-foreground">Total:</span>
                    <span className="text-2xl text-primary text-glow-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
                  onClick={() => {
                    window.open("https://t.me/+K0IjJ9J3V6RjMzJh", "_blank")
                  }}
                >
                  Finalizar Compra
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
