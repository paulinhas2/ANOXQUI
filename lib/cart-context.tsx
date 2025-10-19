"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Coupon } from "./products-context"

interface CartItem {
  id: string
  title: string
  image: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  openCart: () => void
  appliedCoupon: Coupon | null
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  subtotal: number
  discount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)

  useEffect(() => {
    const savedCart = localStorage.getItem("digitalstore-cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("digitalstore-cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (existingItem) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const openCart = () => {
    setIsCartOpen(true)
  }

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discount = (subtotal * appliedCoupon.discountValue) / 100
    } else {
      discount = appliedCoupon.discountValue
    }
  }

  const total = Math.max(0, subtotal - discount)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        openCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
