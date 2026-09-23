'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, FlaskConical, House, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react'
import { CartDrawer } from '@/components/cart-drawer'
import { CheckoutModal } from '@/components/checkout-modal'
import { ProductChat } from '@/components/product-chat'
import { SiteFooter } from '@/components/site-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppUI } from '@/components/app-ui'
import { useCart } from '@/components/cart-provider'
import { cn } from '@/lib/utils'

type FooterTab = 'home' | 'catalog' | 'cart' | 'ask'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { panel, isCheckoutOpen, openCart, openChat, closePanel, openCheckout, closeCheckout } = useAppUI()
  const { cartItems, removeItem, updateQuantity, clearCart } = useCart()
  const [hash, setHash] = useState('')
  const [checkoutItems, setCheckoutItems] = useState<{ productId: string; quantity: number }[]>([])

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (isCheckoutOpen) {
        closeCheckout()
        return
      }
      closePanel()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isCheckoutOpen, closeCheckout, closePanel])

  useEffect(() => {
    const locked = panel !== 'none' || isCheckoutOpen
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [panel, isCheckoutOpen])

  const isProductPage = pathname.startsWith('/products/')
  const isNestedPage = pathname !== '/'
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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-background/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          {isNestedPage ? (
            <Link
              href={isProductPage ? '/' : '/'}
              className="inline-flex min-h-11 min-w-11 items-center gap-1 text-sm font-medium text-muted-foreground"
              aria-label={isProductPage ? 'Back to catalog' : 'Back to home'}
            >
              <ChevronLeft className="h-5 w-5" />
              {isProductPage ? 'Catalog' : 'Home'}
            </Link>
          ) : (
            <a
              href="#top"
              onClick={(event) => {
                event.preventDefault()
                goHome()
              }}
              className="flex min-h-11 items-center gap-2.5"
              aria-label="Mstrmnd home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                <FlaskConical className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block font-heading text-sm font-semibold leading-none tracking-tight">Mstrmnd</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Clinical supply
                </span>
              </span>
            </a>
          )}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
              Research only
            </span>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto w-full max-w-lg px-4 pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[calc(5.25rem+env(safe-area-inset-bottom))]">
        {children}
        <SiteFooter />
      </main>

      {panel !== 'none' && (
        <button
          type="button"
          aria-label="Close panel"
          className="fixed inset-0 z-[45] bg-black/40 backdrop-blur-[2px]"
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
          if (cartItems.length === 0) return
          setCheckoutItems(cartItems.map(({ id, quantity }) => ({ productId: id, quantity })))
          openCheckout()
        }}
        onReturnToCatalog={goCatalog}
      />
      <ProductChat
        open={panel === 'chat'}
        onClose={closePanel}
        onNavigate={() => {
          closePanel()
        }}
      />
      <CheckoutModal
        items={checkoutItems}
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        onComplete={clearCart}
        onReturnToCatalog={() => {
          closeCheckout()
          goCatalog()
        }}
      />

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
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
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex min-h-11 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
        active ? 'text-foreground' : 'text-muted-foreground',
      )}
    >
      <span className="relative">
        <Icon className={cn('h-5 w-5', active && 'stroke-[2.25]')} />
        {badge ? (
          <span className="absolute -right-2.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
            {badge}
          </span>
        ) : null}
      </span>
      {label}
    </button>
  )
}
