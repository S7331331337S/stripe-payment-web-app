'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const isOutOfStock = product.stock < 1

  return (
    <Button
      disabled={isOutOfStock}
      onClick={() => {
        addToCart(product)
        setAdded(true)
        clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => setAdded(false), 1800)
      }}
      className="min-h-12 w-full rounded-xl bg-slate-950 text-white transition-transform hover:bg-slate-800 active:scale-[0.98]"
    >
      {added ? (
        <Check className="h-4 w-4 scale-110 transition-transform duration-300" />
      ) : (
        <ShoppingCart className="h-4 w-4 transition-transform duration-300" />
      )}
      <span key={added ? 'added' : 'idle'} className="motion-item-in">
        {added ? 'Added to cart' : isOutOfStock ? 'Out of stock' : 'Add to cart'}
      </span>
    </Button>
  )
}
