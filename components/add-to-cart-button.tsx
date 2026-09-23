'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppUI } from '@/components/app-ui'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, cartItems } = useCart()
  const { openCart } = useAppUI()
  const alreadyInCart = cartItems.find((item) => item.id === product.id)?.quantity ?? 0
  const maxQuantity = Math.max(0, product.stock - alreadyInCart)
  const [quantity, setQuantity] = useState(product.stock > 0 ? 1 : 0)
  const [added, setAdded] = useState(false)
  const canAdd = product.stock > 0 && maxQuantity > 0 && quantity > 0

  useEffect(() => {
    setQuantity((current) => {
      if (maxQuantity <= 0) return 0
      return Math.min(Math.max(current, 1), maxQuantity)
    })
  }, [maxQuantity])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl bg-background/80 px-2 py-1">
        <p className="pl-2 text-sm text-muted-foreground">Quantity</p>
        <div className="flex items-center">
          <button
            type="button"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-mono text-base font-semibold text-foreground">{quantity || 0}</span>
          <button
            type="button"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      {alreadyInCart > 0 ? (
        <p className="text-xs text-muted-foreground">
          {alreadyInCart} already in cart
          {maxQuantity > 0 ? ` · ${maxQuantity} more available` : ' · stock limit reached'}
        </p>
      ) : null}
      <Button
        disabled={!canAdd}
        onClick={() => {
          addToCart(product, quantity)
          setAdded(true)
          openCart()
          setQuantity(Math.min(1, Math.max(0, maxQuantity - quantity)))
          setTimeout(() => setAdded(false), 1800)
        }}
        className="h-12 w-full rounded-2xl bg-foreground text-background transition-transform hover:bg-foreground/90 active:scale-[0.98]"
      >
        <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${added ? 'scale-110' : ''}`} />
        <span key={added ? 'added' : 'idle'} className="motion-item-in">
          {added
            ? 'Added to cart'
            : product.stock === 0
              ? 'Out of stock'
              : maxQuantity === 0
                ? 'Cart limit reached'
                : `Add ${quantity} to cart`}
        </span>
      </Button>
    </div>
  )
}
