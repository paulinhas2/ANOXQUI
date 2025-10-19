"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/lib/cart-context"
import { CreditCard, Lock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearCart()
    router.push("/sucesso")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Carrinho Vazio</h1>
            <p className="text-muted-foreground">Adicione produtos ao carrinho para finalizar a compra.</p>
            <Button
              onClick={() => router.push("/")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              Voltar para Loja
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-mono text-primary text-glow-primary mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Informações Pessoais</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" required className="bg-background border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="bg-background border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" required className="bg-background border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" required className="bg-background border-border/50" />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Informações de Pagamento</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      required
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" required className="bg-background border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" required className="bg-background border-border/50" />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary h-12 text-lg font-bold"
              >
                {isProcessing ? (
                  "Processando..."
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Confirmar Pagamento - R$ {total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border/50 bg-card p-6 space-y-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground">Resumo do Pedido</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                      <p className="text-sm font-bold text-primary">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R$ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Processamento</span>
                  <span className="text-foreground">R$ 0,00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50">
                  <span className="text-foreground">Total</span>
                  <span className="text-2xl text-primary text-glow-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
