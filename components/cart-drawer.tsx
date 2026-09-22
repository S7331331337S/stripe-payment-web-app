'use client'

import { ArrowLeft, Minus, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/products'

interface CartItem extends Product {
  quantity: number
}

interface CartDrawerProps {
  open: boolean
  items: CartItem[]
  onClose: () => void
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onCheckout: () => void
  onReturnToCatalog?: () => void
}

export function CartDrawer({
  open,
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  onReturnToCatalog,
}: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)
  const totalInDollars = (total / 100).toFixed(2)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function returnToCatalog() {
    onClose()
    if (onReturnToCatalog) {
      onReturnToCatalog()
      return
    }
    if (typeof window !== 'undefined') {
      window.location.assign('/#catalog')
    }
  }

  return (
    <aside
      aria-hidden={!open}
      className={cn(
        'fixed inset-x-0 z-[46] mx-auto flex w-full max-w-lg flex-col rounded-t-3xl border border-slate-200/80 bg-background shadow-[0_-18px_50px_-20px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out',
        'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] max-h-[min(38rem,calc(100dvh-6.5rem-env(safe-area-inset-bottom)))]',
        open ? 'translate-y-0' : 'pointer-events-none translate-y-[120%]',
      )}
    >
      <div className="flex items-center justify-between px-5 pb-3 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">Bag</p>
          <h2 className="text-lg font-semibold tracking-tight">
            {itemCount === 0 ? 'Your cart' : `${itemCount} item${itemCount === 1 ? '' : 's'}`}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Close cart"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
        {items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
            <div>
              <p className="text-sm font-medium text-slate-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Browse the catalog and add a compound.</p>
            </div>
            <Button variant="outline" onClick={returnToCatalog} className="min-h-11 rounded-2xl">
              <ArrowLeft className="h-4 w-4" />
              Return to catalog
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="motion-item-in flex gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-slate-950">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">${(item.priceInCents / 100).toFixed(2)} each</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center rounded-full bg-slate-100">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/80 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold text-slate-950">${totalInDollars}</span>
        </div>
        <div className="space-y-2">
          <Button onClick={onCheckout} disabled={items.length === 0} className="h-12 w-full rounded-2xl bg-slate-950 text-white">
            Checkout securely
          </Button>
          <Button variant="outline" onClick={returnToCatalog} className="h-12 w-full rounded-2xl">
            <ArrowLeft className="h-4 w-4" />
            Return to catalog
          </Button>
        </div>
      </div>
    </aside>
  )
}
