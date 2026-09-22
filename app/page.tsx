'use client'

import { useEffect, useState } from 'react'
import { ArrowDownRight, FlaskConical, LockKeyhole, Menu, Package, ShoppingBag, Sparkles, X } from 'lucide-react'
import { Catalog } from '@/components/catalog'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { useCart } from '@/components/cart-provider'
import { PRODUCTS } from '@/lib/products'

export default function StorefrontPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems, addToCart, removeItem, updateQuantity } = useCart()

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="G's Stock home">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">G&apos;s Stock</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Clinical supply</p>
            </div>
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:block">Private catalog</span>
            <nav aria-label="Primary navigation" className="flex items-center gap-1">
              <a href="#catalog" className="hidden min-h-11 items-center px-3 text-xs font-medium text-slate-600 hover:text-slate-950 sm:flex">Catalog</a>
              <a href="#standards" className="hidden min-h-11 items-center px-3 text-xs font-medium text-slate-600 hover:text-slate-950 sm:flex">Standards</a>
              <button type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/60 sm:hidden">
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </nav>
          </div>
        </div>
        {isMenuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200/70 px-5 py-3 sm:hidden"><div className="mx-auto flex max-w-7xl gap-2"><a onClick={() => setIsMenuOpen(false)} href="#catalog" className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-800">Catalog</a><a onClick={() => setIsMenuOpen(false)} href="#standards" className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-800">Standards</a></div></nav>}
      </header>

      <main id="top" className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="mb-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700"><Sparkles className="h-3.5 w-3.5" /> Curated research supply</div>
            <h1 className="font-serif text-[clamp(3.2rem,14vw,7rem)] leading-[0.88] tracking-[-0.06em] text-slate-950">A clearer standard for modern research.</h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">A considered collection of research compounds, presented with clarity and handled with care.</p>
            <a href="#catalog" className="mt-9 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition-transform hover:translate-y-[-2px]">Explore catalog <ArrowDownRight className="h-4 w-4" /></a>
          </div>
        </section>

        <section className="mb-16 grid gap-3 border-y border-slate-200/80 py-5 sm:grid-cols-3">
          {[{ icon: FlaskConical, title: 'Research focused', text: 'Clear catalog notes' }, { icon: LockKeyhole, title: 'Secure checkout', text: 'Protected by Stripe' }, { icon: Package, title: 'Discreet dispatch', text: 'Packed with intention' }].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-center gap-3"><Icon className="h-4 w-4 text-indigo-700" /><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="text-xs text-slate-500">{text}</p></div></div>)}
        </section>

        <section id="catalog" className="scroll-mt-24">
          <div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">The collection</p><h2 className="mt-2 font-serif text-4xl tracking-[-0.04em] text-slate-950">Browse the catalog</h2></div><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><ShoppingBag className="h-4 w-4" /> {PRODUCTS.length} compounds</div></div>
          <Catalog products={PRODUCTS} onAddToCart={addToCart} />
        </section>

        <section id="standards" className="mt-16 scroll-mt-24 rounded-[1.5rem] bg-slate-950 p-7 text-white sm:p-10"><p className="text-xs uppercase tracking-[0.2em] text-indigo-200">A note on responsible research</p><h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Precision starts with knowing exactly what you are ordering.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">Products in this catalog are intended for research use only. Please review each detail sheet and all applicable handling and compliance requirements before ordering.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[{ title: 'Clear catalog notes', text: 'Product details and availability are visible before checkout.' }, { title: 'Protected payments', text: 'Checkout is securely handled by Stripe.' }, { title: 'Order updates', text: 'Order confirmation is provided during the checkout process.' }].map((item) => <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="font-medium">{item.title}</p><p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p></div>)}</div></section>
      </main>

      <CartDrawer items={cartItems} onRemoveItem={removeItem} onUpdateQuantity={updateQuantity} onCheckout={() => cartItems.length > 0 && setIsCheckoutOpen(true)} />
      <CheckoutModal items={cartItems.map(({ id, quantity }) => ({ productId: id, quantity }))} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  )
}
