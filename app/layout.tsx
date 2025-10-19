import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { ProductsProvider } from "@/lib/products-context"
import { BadgesProvider } from "@/lib/badges-context"
import { PromotionsProvider } from "@/lib/promotions-context"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "ANOX MARKETPLACE",
  description: "ANOX MARKETPLACE - Sua loja digital de confiança",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense>
          <BadgesProvider>
            <PromotionsProvider>
              <ProductsProvider>
                <CartProvider>{children}</CartProvider>
              </ProductsProvider>
            </PromotionsProvider>
          </BadgesProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
