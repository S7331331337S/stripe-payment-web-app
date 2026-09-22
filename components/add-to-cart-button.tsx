'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppUI } from '@/components/app-ui'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { openCart } = useAppUI()
  const [added, setAdded] = useState(false)
  return (
    <Button
      disabled={product.stock === 0}
      onClick={() => {
        addToCart(product)
        setAdded(true)
        openCart()
        setTimeout(() => setAdded(false), 1800)
      }}
      className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
    >
      <ShoppingCart className="h-4 w-4" />
      {added ? 'Added to cart' : product.stock > 0 ? 'Add to cart' : 'Out of stock'}
    </Button>
  )
}
