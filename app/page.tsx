'use client'

import { useEffect } from 'react'
import { ArrowDown, FlaskConical, LockKeyhole, Package, Sparkles } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Reveal } from '@/components/reveal'
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
        <div className="motion-float-slow pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="motion-float-slower pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />

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
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">The collection</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground">Browse the catalog</h2>
            </div>
            <p className="pb-1 text-xs text-muted-foreground">{PRODUCTS.length} compounds</p>
          </div>
        </Reveal>
        <div className="grid gap-3">
          {PRODUCTS.map((product, index) => (
            <Reveal key={product.id} delayMs={(index % 3) * 80}>
              <ProductCard product={product} onAddToCart={addToCart} />
            </Reveal>
          ))}
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
            handling and compliance requirements before ordering.
          </p>
        </section>
      </Reveal>
    </>
  )
}
