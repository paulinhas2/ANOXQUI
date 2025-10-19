"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface Product {
  id: string
  title: string
  image: string
  images?: string[]
  originalPrice: number
  categories: string[]
  featured?: boolean
  badgeId?: string
  description?: string
  pageLayout?: "default" | "minimal" | "detailed"
  customSections?: Array<{ type: string; content: string }>
  enableReviews?: boolean
  customRating?: number
  totalReviews?: number
  relatedProductIds?: string[]
}

export interface Coupon {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  expiryDate?: string
  usageLimit?: number
  usedCount: number
  active: boolean
}

interface ProductsContextType {
  products: Product[]
  categories: string[]
  coupons: Coupon[]
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (category: string) => Promise<void>
  deleteCategory: (category: string) => Promise<void>
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount">) => Promise<void>
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>
  deleteCoupon: (id: string) => Promise<void>
  validateCoupon: (code: string) => Coupon | null
  isLoading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let productsChannel: RealtimeChannel
    let categoriesChannel: RealtimeChannel
    let couponsChannel: RealtimeChannel

    async function loadInitialData() {
      try {
        // Load products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false })

        if (productsError) {
          console.error("[v0] Error loading products:", productsError)
        } else if (productsData) {
          const transformedProducts = productsData.map((p) => ({
            id: p.id,
            title: p.name,
            image: p.image,
            images: p.images && p.images.length > 0 ? p.images : [p.image],
            originalPrice: Number(p.original_price || p.price), // Support both old and new column names during migration
            categories:
              p.categories && Array.isArray(p.categories) && p.categories.length > 0
                ? p.categories
                : p.category
                  ? [p.category]
                  : ["Sem Categoria"],
            featured: p.featured || false,
            badgeId: p.badge_id || null,
            description: p.description || "",
            pageLayout: p.page_layout || "default",
            customSections: p.custom_sections || [],
            enableReviews: p.enable_reviews !== false,
            customRating: p.custom_rating || 4.5,
            totalReviews: p.total_reviews || 0,
            relatedProductIds: p.related_product_ids || [],
          }))
          setProducts(transformedProducts)
        }

        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("categories")
          .select("name")
          .order("name")

        if (categoriesError) {
          console.error("[v0] Error loading categories:", categoriesError)
        } else if (categoriesData) {
          setCategories(categoriesData.map((c) => c.name))
        }

        // Load coupons
        const { data: couponsData, error: couponsError } = await supabase
          .from("coupons")
          .select("*")
          .order("created_at", { ascending: false })

        if (couponsError) {
          console.error("[v0] Error loading coupons:", couponsError)
        } else if (couponsData) {
          const transformedCoupons = couponsData.map((c) => ({
            id: c.id,
            code: c.code,
            discountType: c.type as "percentage" | "fixed",
            discountValue: Number(c.discount),
            active: c.active,
            usedCount: 0,
          }))
          setCoupons(transformedCoupons)
        }
      } catch (error) {
        console.error("[v0] Error loading initial data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()

    // Set up real-time subscriptions for products
    productsChannel = supabase
      .channel("products-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, (payload) => {
        console.log("[v0] Products change detected:", payload)

        if (payload.eventType === "INSERT") {
          const newProduct = payload.new as any
          setProducts((prev) => [
            {
              id: newProduct.id,
              title: newProduct.name,
              image: newProduct.image,
              images: newProduct.images && newProduct.images.length > 0 ? newProduct.images : [newProduct.image],
              originalPrice: Number(newProduct.original_price || newProduct.price),
              categories:
                newProduct.categories && Array.isArray(newProduct.categories) && newProduct.categories.length > 0
                  ? newProduct.categories
                  : newProduct.category
                    ? [newProduct.category]
                    : ["Sem Categoria"],
              featured: newProduct.featured || false,
              badgeId: newProduct.badge_id || null,
              description: newProduct.description || "",
              pageLayout: newProduct.page_layout || "default",
              customSections: newProduct.custom_sections || [],
              enableReviews: newProduct.enable_reviews !== false,
              customRating: newProduct.custom_rating || 4.5,
              totalReviews: newProduct.total_reviews || 0,
              relatedProductIds: newProduct.related_product_ids || [],
            },
            ...prev,
          ])
        } else if (payload.eventType === "UPDATE") {
          const updatedProduct = payload.new as any
          setProducts((prev) =>
            prev.map((p) =>
              p.id === updatedProduct.id
                ? {
                    id: updatedProduct.id,
                    title: updatedProduct.name,
                    image: updatedProduct.image,
                    images:
                      updatedProduct.images && updatedProduct.images.length > 0
                        ? updatedProduct.images
                        : [updatedProduct.image],
                    originalPrice: Number(updatedProduct.original_price || updatedProduct.price),
                    categories:
                      updatedProduct.categories &&
                      Array.isArray(updatedProduct.categories) &&
                      updatedProduct.categories.length > 0
                        ? updatedProduct.categories
                        : updatedProduct.category
                          ? [updatedProduct.category]
                          : ["Sem Categoria"],
                    featured: updatedProduct.featured || false,
                    badgeId: updatedProduct.badge_id || null,
                    description: updatedProduct.description || "",
                    pageLayout: updatedProduct.page_layout || "default",
                    customSections: updatedProduct.custom_sections || [],
                    enableReviews: updatedProduct.enable_reviews !== false,
                    customRating: updatedProduct.custom_rating || 4.5,
                    totalReviews: updatedProduct.total_reviews || 0,
                    relatedProductIds: updatedProduct.related_product_ids || [],
                  }
                : p,
            ),
          )
        } else if (payload.eventType === "DELETE") {
          setProducts((prev) => prev.filter((p) => p.id !== payload.old.id))
        }
      })
      .subscribe()

    // Set up real-time subscriptions for categories
    categoriesChannel = supabase
      .channel("categories-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, (payload) => {
        console.log("[v0] Categories change detected:", payload)

        if (payload.eventType === "INSERT") {
          const newCategory = payload.new as any
          setCategories((prev) => [...prev, newCategory.name])
        } else if (payload.eventType === "DELETE") {
          const deletedCategory = payload.old as any
          setCategories((prev) => prev.filter((c) => c !== deletedCategory.name))
        }
      })
      .subscribe()

    // Set up real-time subscriptions for coupons
    couponsChannel = supabase
      .channel("coupons-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "coupons" }, (payload) => {
        console.log("[v0] Coupons change detected:", payload)

        if (payload.eventType === "INSERT") {
          const newCoupon = payload.new as any
          setCoupons((prev) => [
            {
              id: newCoupon.id,
              code: newCoupon.code,
              discountType: newCoupon.type as "percentage" | "fixed",
              discountValue: Number(newCoupon.discount),
              active: newCoupon.active,
              usedCount: 0,
            },
            ...prev,
          ])
        } else if (payload.eventType === "UPDATE") {
          const updatedCoupon = payload.new as any
          setCoupons((prev) =>
            prev.map((c) =>
              c.id === updatedCoupon.id
                ? {
                    ...c,
                    code: updatedCoupon.code,
                    discountType: updatedCoupon.type as "percentage" | "fixed",
                    discountValue: Number(updatedCoupon.discount),
                    active: updatedCoupon.active,
                  }
                : c,
            ),
          )
        } else if (payload.eventType === "DELETE") {
          setCoupons((prev) => prev.filter((c) => c.id !== payload.old.id))
        }
      })
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(productsChannel)
      supabase.removeChannel(categoriesChannel)
      supabase.removeChannel(couponsChannel)
    }
  }, [])

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const { error } = await supabase.from("products").insert({
        name: product.title,
        price: product.originalPrice,
        image: product.image,
        images: product.images || [product.image],
        categories: product.categories.length > 0 ? product.categories : ["Sem Categoria"],
        category: product.categories[0] || "Sem Categoria",
        description: product.description || "",
        featured: product.featured || false,
        badge_id: product.badgeId || null,
        page_layout: product.pageLayout || "default",
        custom_sections: product.customSections || [],
        enable_reviews: product.enableReviews !== false,
        custom_rating: product.customRating || 4.5,
        total_reviews: product.totalReviews || 0,
        related_product_ids: product.relatedProductIds || [],
        stock: 100,
      })

      if (error) {
        console.error("[v0] Error adding product:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in addProduct:", error)
    }
  }

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const updateData: any = {}
      if (updatedProduct.title) updateData.name = updatedProduct.title
      if (updatedProduct.originalPrice !== undefined) updateData.price = updatedProduct.originalPrice
      if (updatedProduct.image) updateData.image = updatedProduct.image
      if (updatedProduct.images) updateData.images = updatedProduct.images
      if (updatedProduct.categories) {
        updateData.categories = updatedProduct.categories.length > 0 ? updatedProduct.categories : ["Sem Categoria"]
        updateData.category = updatedProduct.categories[0] || "Sem Categoria"
      }
      if (updatedProduct.description !== undefined) updateData.description = updatedProduct.description
      if (updatedProduct.featured !== undefined) updateData.featured = updatedProduct.featured
      if (updatedProduct.badgeId !== undefined) {
        updateData.badge_id = updatedProduct.badgeId === "" ? null : updatedProduct.badgeId
      }
      if (updatedProduct.pageLayout !== undefined) updateData.page_layout = updatedProduct.pageLayout
      if (updatedProduct.customSections !== undefined) updateData.custom_sections = updatedProduct.customSections
      if (updatedProduct.enableReviews !== undefined) updateData.enable_reviews = updatedProduct.enableReviews
      if (updatedProduct.customRating !== undefined) updateData.custom_rating = updatedProduct.customRating
      if (updatedProduct.totalReviews !== undefined) updateData.total_reviews = updatedProduct.totalReviews
      if (updatedProduct.relatedProductIds !== undefined)
        updateData.related_product_ids = updatedProduct.relatedProductIds

      console.log("[v0] Updating product with ID:", id)
      console.log("[v0] Update data:", updateData)

      const { data, error } = await supabase.from("products").update(updateData).eq("id", id).select()

      if (error) {
        console.error("[v0] Error updating product:", error)
        alert(`Erro ao atualizar produto: ${error.message}`)
        throw error
      }

      console.log("[v0] Product updated successfully:", data)
    } catch (error) {
      console.error("[v0] Error in updateProduct:", error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting product:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in deleteProduct:", error)
    }
  }

  const addCategory = async (category: string) => {
    if (categories.includes(category)) return

    try {
      const { error } = await supabase.from("categories").insert({ name: category })

      if (error) {
        console.error("[v0] Error adding category:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in addCategory:", error)
    }
  }

  const deleteCategory = async (category: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("name", category)

      if (error) {
        console.error("[v0] Error deleting category:", error)
        throw error
      }

      await supabase.from("products").update({ category: "Sem Categoria" }).eq("category", category)
    } catch (error) {
      console.error("[v0] Error in deleteCategory:", error)
    }
  }

  const addCoupon = async (coupon: Omit<Coupon, "id" | "usedCount">) => {
    try {
      const { error } = await supabase.from("coupons").insert({
        code: coupon.code,
        discount: coupon.discountValue,
        type: coupon.discountType,
        active: coupon.active,
      })

      if (error) {
        console.error("[v0] Error adding coupon:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in addCoupon:", error)
    }
  }

  const updateCoupon = async (id: string, updatedCoupon: Partial<Coupon>) => {
    try {
      const updateData: any = {}
      if (updatedCoupon.code) updateData.code = updatedCoupon.code
      if (updatedCoupon.discountValue !== undefined) updateData.discount = updatedCoupon.discountValue
      if (updatedCoupon.discountType) updateData.type = updatedCoupon.discountType
      if (updatedCoupon.active !== undefined) updateData.active = updatedCoupon.active

      const { error } = await supabase.from("coupons").update(updateData).eq("id", id)

      if (error) {
        console.error("[v0] Error updating coupon:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in updateCoupon:", error)
    }
  }

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase.from("coupons").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting coupon:", error)
        throw error
      }
    } catch (error) {
      console.error("[v0] Error in deleteCoupon:", error)
    }
  }

  const validateCoupon = (code: string): Coupon | null => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase())

    if (!coupon) return null
    if (!coupon.active) return null
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return null
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return null

    return coupon
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        coupons,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        isLoading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
