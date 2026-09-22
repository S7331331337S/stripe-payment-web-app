'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '@/lib/products'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextValue {
  cartItems: CartItem[]
  /** Total units across the cart (not the number of distinct products). */
  itemCount: number
  /** Cart total in cents. */
  totalInCents: number
  addToCart: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'gs-stock.cart.v1'

/** Quantities are always clamped to live catalog stock. */
function clampToStock(quantity: number, stock: number): number {
  return Math.max(0, Math.min(Math.trunc(quantity), stock))
}

/**
 * Rehydrates a persisted cart against the current catalog: unknown products are
 * dropped and quantities are re-clamped, so a stale cart can never push an
 * order past what is actually in stock.
 */
function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const items: CartItem[] = []
    for (const entry of parsed) {
      if (typeof entry !== 'object' || entry === null) continue
      const { id, quantity } = entry as { id?: unknown; quantity?: unknown }
      if (typeof id !== 'string' || typeof quantity !== 'number') continue
      const product = PRODUCTS.find((candidate) => candidate.id === id)
      if (!product) continue
      const clamped = clampToStock(quantity, product.stock)
      if (clamped > 0) items.push({ ...product, quantity: clamped })
    }
    return items
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Hydrate after mount so the server and client render the same initial HTML.
  useEffect(() => {
    const stored = readStoredCart()
    if (stored.length > 0) setCartItems(stored)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems.map(({ id, quantity }) => ({ id, quantity }))),
      )
    } catch {
      // Storage can be unavailable (private mode, blocked site data). The cart
      // still works for this visit; it just won't survive a reload.
    }
  }, [cartItems])

  const addToCart = useCallback((product: Product) => {
    setCartItems((previous) => {
      const existing = previous.find((item) => item.id === product.id)
      if (!existing) {
        return product.stock > 0 ? [...previous, { ...product, quantity: 1 }] : previous
      }
      const next = clampToStock(existing.quantity + 1, product.stock)
      return previous.map((item) => (item.id === product.id ? { ...item, quantity: next } : item))
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCartItems((previous) => previous.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((previous) => {
      const target = previous.find((item) => item.id === productId)
      if (!target) return previous
      const next = clampToStock(quantity, target.stock)
      if (next < 1) return previous.filter((item) => item.id !== productId)
      return previous.map((item) => (item.id === productId ? { ...item, quantity: next } : item))
    })
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      totalInCents: cartItems.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0),
      addToCart,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [cartItems, addToCart, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
