'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { PRODUCTS, type Product } from '@/lib/products'

export interface CartItem extends Product {
  quantity: number
}

interface CartContextValue {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'gs-stock-cart'

function clampQuantity(quantity: number, stock: number) {
  if (!Number.isFinite(quantity) || stock <= 0) return 0
  return Math.min(stock, Math.max(1, Math.floor(quantity)))
}

function hydrateCart(entries: Array<{ id: string; quantity: number }>): CartItem[] {
  return entries.flatMap((entry) => {
    const product = PRODUCTS.find((item) => item.id === entry.id)
    if (!product) return []
    const quantity = clampQuantity(entry.quantity, product.stock)
    return quantity > 0 ? [{ ...product, quantity }] : []
  })
}

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<{ id: string; quantity: number }>
    if (!Array.isArray(parsed)) return []
    return hydrateCart(parsed)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setCartItems(readStoredCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cartItems.map(({ id, quantity }) => ({ id, quantity }))),
    )
  }, [cartItems, ready])

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      addToCart: (product, quantity = 1) =>
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === product.id)
          const nextQuantity = clampQuantity((existing?.quantity ?? 0) + quantity, product.stock)
          if (nextQuantity <= 0) {
            return prev.filter((item) => item.id !== product.id)
          }
          if (existing) {
            return prev.map((item) => (item.id === product.id ? { ...product, quantity: nextQuantity } : item))
          }
          return [...prev, { ...product, quantity: nextQuantity }]
        }),
      removeItem: (productId) => setCartItems((prev) => prev.filter((item) => item.id !== productId)),
      updateQuantity: (productId, quantity) =>
        setCartItems((prev) =>
          prev.flatMap((item) => {
            if (item.id !== productId) return [item]
            const nextQuantity = clampQuantity(quantity, item.stock)
            return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : []
          }),
        ),
      clearCart: () => setCartItems([]),
    }),
    [cartItems],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
