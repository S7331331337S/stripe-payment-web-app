'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Clear the pending "Added!" reset so an unmounting card cannot set state.
  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const handleAddToCart = () => {
    onAddToCart(product)
    setIsAdded(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setIsAdded(false), 2000)
  }

  const priceInDollars = (product.priceInCents / 100).toFixed(2)
  const isOutOfStock = product.stock < 1
  const isLowStock = !isOutOfStock && product.stock <= 5
  const benefits = product.benefits.split(',').map((benefit) => benefit.trim()).filter(Boolean)

  return (
    <article className="group relative flex min-w-0 max-w-full flex-col gap-4 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/70 p-5 shadow-[0_12px_40px_-20px_rgba(42,54,92,0.3)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(42,54,92,0.4)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-200/60 blur-3xl transition-opacity group-hover:opacity-90" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-28 w-28 rounded-full bg-sky-100/70 blur-3xl" />

      <div className="relative">
        <h3 className="font-semibold text-foreground">{product.name}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{product.description}</p>
      </div>

      <ul className="relative flex flex-wrap gap-1">
        {benefits.map((benefit, index) => (
          <li
            key={`${benefit}-${index}`}
            className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
          >
            {benefit}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto flex items-end justify-between pt-2">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary">${priceInDollars}</span>
          <span
            className={`text-xs font-medium ${
              isOutOfStock ? 'text-destructive' : isLowStock ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {isOutOfStock
              ? 'Out of stock'
              : `${product.stock} ${product.stock === 1 ? 'unit' : 'units'} available`}
          </span>
        </div>
      </div>

      <div className="relative flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          variant={isAdded ? 'default' : 'outline'}
          className="min-h-11 flex-1"
        >
          {isAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          {isAdded ? 'Added' : isOutOfStock ? 'Unavailable' : 'Add to cart'}
        </Button>
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white/70 px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-white"
        >
          Details <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
