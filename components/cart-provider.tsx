'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import type { Product } from '@/lib/products'

export interface CartItem extends Product { quantity: number }

interface CartContextValue {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const value = useMemo<CartContextValue>(() => ({
    cartItems,
    addToCart: (product) => setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      return existing ? prev.map((item) => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item) : [...prev, { ...product, quantity: 1 }]
    }),
    removeItem: (productId) => setCartItems((prev) => prev.filter((item) => item.id !== productId)),
    updateQuantity: (productId, quantity) => quantity <= 0
      ? setCartItems((prev) => prev.filter((item) => item.id !== productId))
      : setCartItems((prev) => prev.map((item) => item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock) } : item)),
  }), [cartItems])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
