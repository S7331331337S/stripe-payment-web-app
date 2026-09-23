'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, FlaskConical, LockKeyhole, Package, Sparkles } from 'lucide-react'
import { CatalogToolbar } from '@/components/catalog-toolbar'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/components/cart-provider'
import { filterCatalog, type CatalogCategoryId } from '@/lib/catalog'
import { PRODUCTS } from '@/lib/products'

const TRUST_POINTS = [
  { icon: FlaskConical, title: 'Research focused', text: 'Clear catalog notes' },
  { icon: LockKeyhole, title: 'Secure checkout', text: 'Protected by Stripe' },
  { icon: Package, title: 'Discreet dispatch', text: 'Packed with intention' },
]

export default function StorefrontPage() {
  const { addToCart } = useCart()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CatalogCategoryId | 'all'>('all')
  const visibleProducts = useMemo(() => filterCatalog(PRODUCTS, query, category), [query, category])

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#catalog' || hash === '#standards') {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    }
  }, [])

  return (
    <>
      <section className="relative mb-[var(--app-footer)] flex min-h-[calc(100dvh-var(--app-chrome))] flex-col justify-between overflow-hidden py-3">
        <div className="hero-teal-wash pointer-events-none absolute inset-x-0 top-0 h-[32rem]" />
        <div className="motion-float-slow pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-500/15" />
        <div className="motion-float-slower pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-cyan-100/60 blur-3xl dark:bg-cyan-400/10" />

        <p
          className="reveal-load relative inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand"
          style={{ animationDelay: '40ms' }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Curated research supply
        </p>

        <div className="relative">
          <h1 className="max-w-[11ch] text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground">
            <span className="reveal-clip block">
              <span className="reveal-clip-inner" style={{ animationDelay: '110ms' }}>
                A clearer standard
              </span>
            </span>
            <span className="reveal-clip block">
              <span className="reveal-clip-inner" style={{ animationDelay: '200ms' }}>
                for modern research.
              </span>
            </span>
          </h1>
          <div className="mt-5 h-px w-16 bg-brand-muted" />
          <p className="reveal-load mt-5 max-w-sm text-base leading-7 text-muted-foreground" style={{ animationDelay: '260ms' }}>
            A considered collection of research compounds, presented with clarity and handled with care.
          </p>
        </div>

        <div className="relative space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-[11px] font-semibold leading-tight text-foreground">{title}</p>
                <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <a
            href="#catalog"
            className="reveal-load inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background"
            style={{ animationDelay: '380ms' }}
          >
            Browse catalog
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-20 border-t border-border pt-10">
        <Reveal>
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">The collection</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">Browse the catalog</h2>
          </div>
        </Reveal>
        <Reveal>
          <CatalogToolbar
            query={query}
            category={category}
            resultCount={visibleProducts.length}
            totalCount={PRODUCTS.length}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
          />
        </Reveal>
        <div className="mt-4 grid gap-3">
          {visibleProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center">
              <p className="font-medium text-foreground">No compounds match that search</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another term or clear the current filters.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setCategory('all')
                }}
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background"
              >
                Reset catalog
              </button>
            </div>
          ) : (
            visibleProducts.map((product, index) => (
              <Reveal key={product.id} delayMs={(index % 3) * 80}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </Reveal>
            ))
          )}
        </div>
      </section>

      <Reveal>
        <section id="standards" className="mt-8 scroll-mt-20 rounded-3xl bg-foreground p-6 text-background">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand-muted">A note on responsible research</p>
          <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.03em]">
            Precision starts with knowing exactly what you are ordering.
          </h2>
          <p className="mt-3 text-sm leading-6 text-background/70">
            Products in this catalog are intended for research use only. Please review each detail sheet and all applicable
            handling and compliance requirements before ordering. Review{' '}
            <Link href="/terms" className="underline decoration-brand-muted underline-offset-2">
              terms
            </Link>
            ,{' '}
            <Link href="/shipping" className="underline decoration-brand-muted underline-offset-2">
              shipping
            </Link>
            , and{' '}
            <Link href="/privacy" className="underline decoration-brand-muted underline-offset-2">
              privacy
            </Link>{' '}
            before you check out.
          </p>
        </section>
      </Reveal>
    </>
  )
}
