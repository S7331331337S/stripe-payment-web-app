'use client'

import { useEffect } from 'react'
import { ArrowDownRight, FlaskConical, LockKeyhole, Package, Sparkles } from 'lucide-react'
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
      <section className="relative overflow-hidden pb-6 pt-6">
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-indigo-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-sky-100/70 blur-3xl" />
        <div className="relative">
          <p className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Curated research supply
          </p>
          <h1 className="max-w-[14ch] text-[2.05rem] font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950">
            A clearer standard for modern research.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            A considered collection of research compounds, presented with clarity and handled with care.
          </p>
          <a
            href="#catalog"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white"
          >
            Browse catalog
            <ArrowDownRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section aria-label="Why G's Stock" className="-mx-4 mb-8 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex min-w-[13.5rem] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-3"
          >
            <Icon className="h-4 w-4 shrink-0 text-indigo-700" />
            <div>
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="text-xs text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <section id="catalog" className="scroll-mt-20">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">The collection</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Browse the catalog</h2>
          </div>
          <p className="pb-1 text-xs text-slate-500">{PRODUCTS.length} compounds</p>
        </div>
        <div className="grid gap-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <section id="standards" className="mt-8 scroll-mt-20 rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-200">A note on responsible research</p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.03em]">
          Precision starts with knowing exactly what you are ordering.
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Products in this catalog are intended for research use only. Please review each detail sheet and all applicable
          handling and compliance requirements before ordering.
        </p>
      </section>
    </>
  )
}
