"use client"

import { Search, Menu, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { CartSheet } from "@/components/cart-sheet"
import Image from "next/image"

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - AJUSTE O TAMANHO AQUI: Altere h-20 e w-64 para aumentar/diminuir a logo do topo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-20 w-64">
              <Image src="/logo-anox-white.png" alt="ANOX MARKETPLACE" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Pesquise produtos..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 bg-card border-border/50 focus:border-primary focus:glow-primary transition-all"
              />
            </div>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Link href="https://web.telegram.org" target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-card hover:text-primary transition-colors"
                title="Suporte via Telegram"
              >
                <Send className="h-5 w-5" />
              </Button>
            </Link>

            <CartSheet />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-card hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquise produtos..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 bg-card border-border/50 focus:border-primary focus:glow-primary transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
