'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/products'

const sorters = {
  featured: (products: Product[]) => products,
  priceLow: (products: Product[]) => [...products].sort((a, b) => a.priceInCents - b.priceInCents),
  priceHigh: (products: Product[]) => [...products].sort((a, b) => b.priceInCents - a.priceInCents),
  availability: (products: Product[]) => [...products].sort((a, b) => b.stock - a.stock),
}

export function Catalog({ products, onAddToCart }: { products: Product[]; onAddToCart: (product: Product) => void }) {
  const [query, setQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<keyof typeof sorters>('featured')
  const benefits = useMemo(() => Array.from(new Set(products.flatMap((product) => product.benefits.split(',').map((benefit) => benefit.trim())))).slice(0, 8), [products])
  const [benefit, setBenefit] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const matches = products.filter((product) => {
      const searchable = `${product.name} ${product.description} ${product.benefits}`.toLowerCase()
      return (!normalized || searchable.includes(normalized)) && (!inStockOnly || product.stock > 0) && (!benefit || product.benefits.includes(benefit))
    })
    return sorters[sort](matches)
  }, [benefit, inStockOnly, products, query, sort])

  return <>
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative flex min-h-11 flex-1 items-center"><Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the catalog" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500" /></label>
        <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-slate-500" /><select value={sort} onChange={(event) => setSort(event.target.value as keyof typeof sorters)} aria-label="Sort catalog" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500"><option value="featured">Featured</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option><option value="availability">Availability</option></select><button type="button" onClick={() => setInStockOnly((current) => !current)} className={`min-h-11 rounded-xl border px-3 text-sm font-medium ${inStockOnly ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>In stock</button></div>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by catalog note"><button type="button" onClick={() => setBenefit(null)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${benefit === null ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>All notes</button>{benefits.map((item) => <button key={item} type="button" onClick={() => setBenefit(benefit === item ? null : item)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${benefit === item ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{item}</button>)}</div>
    </div>
    <div className="mb-5 text-sm text-slate-500" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'item' : 'items'} shown</div>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center"><p className="font-semibold text-slate-900">No products match those filters.</p><button type="button" onClick={() => { setQuery(''); setInStockOnly(false); setBenefit(null); setSort('featured') }} className="mt-3 text-sm font-medium text-indigo-700">Clear filters</button></div>}
  </>
}
