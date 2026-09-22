'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, FlaskConical, House, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { ProductChat } from '@/components/product-chat'
import { useAppUI } from '@/components/app-ui'
import { useCart } from '@/components/cart-provider'
import { cn } from '@/lib/utils'

type FooterTab = 'home' | 'catalog' | 'cart' | 'ask'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { panel, isCheckoutOpen, openCart, openChat, closePanel, openCheckout, closeCheckout } = useAppUI()
  const { cartItems, removeItem, updateQuantity } = useCart()
  const [hash, setHash] = useState('')

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  const isProductPage = pathname.startsWith('/products/')
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  let activeTab: FooterTab = 'home'
  if (panel === 'cart') activeTab = 'cart'
  else if (panel === 'chat') activeTab = 'ask'
  else if (isProductPage || hash === '#catalog' || hash === '#standards') activeTab = 'catalog'

  function goHome() {
    closePanel()
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', '/')
      setHash('')
      return
    }
    router.push('/')
  }

  function goCatalog() {
    closePanel()
    if (pathname === '/') {
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', '#catalog')
      setHash('#catalog')
      return
    }
    router.push('/#catalog')
  }

  return (
    <div className="app-shell min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-background/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          {isProductPage ? (
            <Link
              href="/"
              className="inline-flex min-h-11 min-w-11 items-center gap-1 text-sm font-medium text-slate-700"
              aria-label="Back to catalog"
            >
              <ChevronLeft className="h-5 w-5" />
              Catalog
            </Link>
          ) : (
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault()
                goHome()
              }}
              className="flex min-h-11 items-center gap-2.5"
              aria-label="G's Stock home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">
                <FlaskConical className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-none tracking-tight">G&apos;s Stock</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Clinical supply
                </span>
              </span>
            </a>
          )}
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
            Research only
          </span>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-lg px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {panel !== 'none' && (
        <button
          type="button"
          aria-label="Close panel"
          className="fixed inset-0 z-[45] bg-slate-950/35 backdrop-blur-[2px]"
          onClick={closePanel}
        />
      )}

      <CartDrawer
        open={panel === 'cart'}
        items={cartItems}
        onClose={closePanel}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => {
          if (cartItems.length > 0) openCheckout()
        }}
      />
      <ProductChat open={panel === 'chat'} onClose={closePanel} />
      <CheckoutModal
        items={cartItems.map(({ id, quantity }) => ({ productId: id, quantity }))}
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
      />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      >
        <div className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-4">
          <FooterButton label="Home" active={activeTab === 'home'} onClick={goHome} icon={House} />
          <FooterButton label="Catalog" active={activeTab === 'catalog'} onClick={goCatalog} icon={Sparkles} />
          <FooterButton
            label="Cart"
            active={activeTab === 'cart'}
            onClick={() => (panel === 'cart' ? closePanel() : openCart())}
            icon={ShoppingBag}
            badge={itemCount}
          />
          <FooterButton
            label="Ask"
            active={activeTab === 'ask'}
            onClick={() => (panel === 'chat' ? closePanel() : openChat())}
            icon={MessageCircle}
          />
        </div>
      </nav>
    </div>
  )
}

function FooterButton({
  label,
  active,
  onClick,
  icon: Icon,
  badge,
}: {
  label: string
  active: boolean
  onClick: () => void
  icon: typeof House
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex min-h-11 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
        active ? 'text-slate-950' : 'text-slate-500',
      )}
    >
      <span className="relative">
        <Icon className={cn('h-5 w-5', active && 'stroke-[2.25]')} />
        {badge ? (
          <span className="absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-semibold text-white">
            {badge}
          </span>
        ) : null}
      </span>
      {label}
    </button>
  )
}
