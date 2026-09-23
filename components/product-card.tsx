'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductMark } from '@/components/product-mark'
import { formatPrice, isLowStock, splitBenefits, stockLabel, stockToneClass } from '@/lib/catalog'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Clear the pending reset so an unmounting card cannot set state.
  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const handleAddToCart = () => {
    onAddToCart(product)
    setIsAdded(true)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setIsAdded(false), 2000)
  }

  const inStock = product.stock > 0
  const lowStock = isLowStock(product.stock)

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-4 shadow-[0_10px_30px_-22px_rgba(42,54,92,0.45)] dark:shadow-[0_12px_32px_-20px_rgba(0,0,0,0.7)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ProductMark product={product} />
          <div className="min-w-0">
            <h3 className="font-mono text-base font-semibold tracking-tight text-foreground">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{product.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold tracking-tight text-foreground">${formatPrice(product.priceInCents)}</p>
          <p className={`text-xs font-medium ${stockToneClass(product.stock)}`}>
            {stockLabel(product.stock)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {splitBenefits(product.benefits)
          .slice(0, 3)
          .map((benefit) => (
            <span key={benefit} className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand">
              {benefit}
            </span>
          ))}
        {lowStock ? (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">Low stock</span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="h-11 flex-1 rounded-2xl bg-foreground text-background transition-transform active:scale-[0.98]"
        >
          <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${isAdded ? 'scale-110' : ''}`} />
          <span key={isAdded ? 'added' : 'add'} className="motion-item-in">
            {isAdded ? 'Added' : 'Add'}
          </span>
        </Button>
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-2xl border border-border bg-card px-3 text-sm font-medium text-foreground"
        >
          Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
