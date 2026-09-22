'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  FlaskConical,
  LockKeyhole,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/components/cart-provider'
import { PRODUCTS } from '@/lib/products'
import { cn } from '@/lib/utils'

const ASSURANCES = [
  { icon: FlaskConical, title: 'Research focused', text: 'Clear catalog notes' },
  { icon: LockKeyhole, title: 'Secure checkout', text: 'Protected by Stripe' },
  { icon: Package, title: 'Discreet dispatch', text: 'Packed with intention' },
]

export default function StorefrontPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems, addToCart } = useCart()

  // Escape closes the mobile menu, matching the cart drawer and checkout modal.
  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const checkoutItems = cartItems.map(({ id, quantity }) => ({ productId: id, quantity }))
  const inStockCount = PRODUCTS.filter((product) => product.stock > 0).length

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="G's Stock home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
              <FlaskConical className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="block">
              <span className="block text-sm font-semibold tracking-tight">G&apos;s Stock</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Clinical supply
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:block">Private catalog</span>
            <nav aria-label="Primary" className="flex items-center gap-1">
              <a
                href="#catalog"
                className="hidden min-h-11 items-center px-3 text-xs font-medium text-slate-600 transition-colors hover:text-slate-950 sm:flex"
              >
                Catalog
              </a>
              <a
                href="#standards"
                className="hidden min-h-11 items-center px-3 text-xs font-medium text-slate-600 transition-colors hover:text-slate-950 sm:flex"
              >
                Standards
              </a>
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/60 transition-colors hover:bg-white sm:hidden"
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </nav>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          aria-hidden={!isMenuOpen}
          inert={!isMenuOpen}
          className={cn(
            'grid overflow-hidden border-slate-200/70 transition-[grid-template-rows,opacity] duration-300 ease-out sm:hidden',
            isMenuOpen
              ? 'grid-rows-[1fr] border-t opacity-100'
              : 'pointer-events-none grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0">
            <div className="mx-auto flex max-w-7xl gap-2 px-5 py-3">
              <a
                onClick={() => setIsMenuOpen(false)}
                href="#catalog"
                className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-800"
              >
                Catalog
              </a>
              <a
                onClick={() => setIsMenuOpen(false)}
                href="#standards"
                className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-800"
              >
                Standards
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id="top" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="motion-float-slow pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="motion-float-slower pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative max-w-3xl">
            <p
              className="reveal-load mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700"
              style={{ animationDelay: '40ms' }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Curated research supply
            </p>
            <h1 className="font-serif text-[clamp(3.2rem,14vw,7rem)] leading-[0.88] tracking-[-0.06em] text-slate-950">
              <span className="reveal-clip block">
                <span className="reveal-clip-inner" style={{ animationDelay: '110ms' }}>
                  A clearer standard{' '}
                </span>
              </span>
              <span className="reveal-clip block">
                <span className="reveal-clip-inner" style={{ animationDelay: '200ms' }}>
                  for modern research.
                </span>
              </span>
            </h1>
            <p
              className="reveal-load mt-8 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
              style={{ animationDelay: '260ms' }}
            >
              A considered collection of research compounds, presented with clarity and handled with care.
            </p>
            <a
              href="#catalog"
              className="reveal-load mt-9 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              style={{ animationDelay: '380ms' }}
            >
              Explore catalog <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        <section
          aria-label="What to expect"
          className="mb-16 grid gap-3 border-y border-slate-200/80 py-5 sm:grid-cols-3"
        >
          {ASSURANCES.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delayMs={index * 70}>
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-indigo-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <section id="catalog" className="scroll-mt-24">
          <Reveal>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
                  The collection
                </p>
                <h2 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-slate-950">
                  Browse the catalog
                </h2>
              </div>
              <p className="hidden shrink-0 items-center gap-2 text-xs text-slate-500 sm:flex">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" /> {inStockCount} of{' '}
                {PRODUCTS.length} compounds in stock
              </p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, index) => (
              // `h-full` so the reveal wrapper does not break equal-height cards.
              <Reveal key={product.id} delayMs={(index % 3) * 80} className="h-full">
                <ProductCard product={product} onAddToCart={addToCart} />
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
          <section
            id="standards"
            className="mt-16 scroll-mt-24 rounded-[1.5rem] bg-slate-950 p-7 text-white sm:p-10"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">
              A note on responsible research
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">
              Precision starts with knowing exactly what you are ordering.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Products in this catalog are intended for research use only. They are not drugs, foods, or
              cosmetics, and are not for human or veterinary consumption. Please review each detail sheet and
              all applicable handling and compliance requirements before ordering.
            </p>
          </section>
        </Reveal>
      </main>

      <footer className="border-t border-slate-200/80 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} G&apos;s Stock. For research use only.</p>
          <p className="flex items-center gap-2">
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
            Payments processed securely by Stripe. Card details never reach our servers.
          </p>
        </div>
      </footer>

      <CartDrawer
        onCheckout={() => cartItems.length > 0 && setIsCheckoutOpen(true)}
        onReturnToCatalog={() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />
      <CheckoutModal
        items={checkoutItems}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  )
}
