'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const priceInDollars = (product.priceInCents / 100).toFixed(2)
  const inStock = product.stock > 0

  return (
    <article className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-4 shadow-[0_10px_30px_-22px_rgba(42,54,92,0.45)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-slate-950">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{product.description}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tracking-tight text-slate-950">${priceInDollars}</p>
          <p className={`text-xs font-medium ${inStock ? 'text-emerald-700' : 'text-red-600'}`}>
            {inStock ? 'In stock' : 'Unavailable'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {product.benefits
          .split(',')
          .slice(0, 3)
          .map((benefit) => (
            <span key={benefit.trim()} className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-medium text-brand">
              {benefit.trim()}
            </span>
          ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="h-11 flex-1 rounded-2xl bg-slate-950 text-white transition-transform active:scale-[0.98]"
        >
          <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${isAdded ? 'scale-110' : ''}`} />
          <span key={isAdded ? 'added' : 'add'} className="motion-item-in">
            {isAdded ? 'Added' : 'Add'}
          </span>
        </Button>
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700"
        >
          Details
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
