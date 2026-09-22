'use client'

import { useEffect } from 'react'
import { ArrowDown, FlaskConical, LockKeyhole, Package, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { useCart } from '@/components/cart-provider'
import { PRODUCTS } from '@/lib/products'

const TRUST_POINTS = [
  { icon: FlaskConical, title: 'Research focused', text: 'Clear catalog notes' },
  { icon: LockKeyhole, title: 'Secure checkout', text: 'Protected by Stripe' },
  { icon: Package, title: 'Discreet dispatch', text: 'Packed with intention' },
]

export default function StorefrontPage() {
  const { addToCart } = useCart()

  useEffect(() => {
    const hash = window.location.hash
    if (hash === '#catalog' || hash === '#standards') {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    }
  }, [])

  return (
    <>
      <section className="relative mb-[var(--app-footer)] flex min-h-[calc(100dvh-var(--app-chrome))] flex-col justify-between overflow-hidden py-3">
        <div className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-brand-muted/35 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-brand-soft blur-3xl" />

        <p className="relative inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          Curated research supply
        </p>

        <div className="relative">
          <h1 className="max-w-[11ch] text-[2.55rem] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground">
            A clearer standard for modern research.
          </h1>
          <div className="mt-5 h-px w-16 bg-brand-muted" />
          <p className="mt-5 max-w-sm text-base leading-7 text-muted-foreground">
            A considered collection of research compounds, presented with clarity and handled with care.
          </p>
        </div>

        <div className="relative space-y-5">
          <a
            href="#catalog"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background"
          >
            Browse catalog
            <ArrowDown className="h-4 w-4" />
          </a>

          <div className="grid gap-3">
            {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="scroll-mt-20 border-t border-border pt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">The collection</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">Browse the catalog</h2>
          </div>
          <p className="pb-1 text-xs text-muted-foreground">{PRODUCTS.length} compounds</p>
        </div>
        <div className="grid gap-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <section id="standards" className="mt-8 scroll-mt-20 rounded-3xl bg-foreground p-6 text-background">
        <p className="text-[11px] uppercase tracking-[0.18em] text-brand-muted">A note on responsible research</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.03em]">
          Precision starts with knowing exactly what you are ordering.
        </h2>
        <p className="mt-3 text-sm leading-6 text-background/70">
          Products in this catalog are intended for research use only. Please review each detail sheet and all applicable
          handling and compliance requirements before ordering.
        </p>
      </section>
    </>
  )
}
