'use client'

import Link from 'next/link'
import { ProductMark } from '@/components/product-mark'
import { formatPrice, stockLabel } from '@/lib/catalog'
import type { Product } from '@/lib/products'

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="mt-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Related compounds</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Often reviewed together</h2>
      <div className="mt-4 grid gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/80 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <ProductMark product={product} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-950">{product.name}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-slate-600">{product.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-950">${formatPrice(product.priceInCents)}</p>
              <p className="text-xs text-muted-foreground">{stockLabel(product.stock)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
