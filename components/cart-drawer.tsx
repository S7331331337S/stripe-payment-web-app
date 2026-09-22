'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'

export function CartDrawer({
  onCheckout,
  onReturnToCatalog,
}: {
  onCheckout: () => void
  /** Omit on pages without a catalog section; the drawer then navigates home. */
  onReturnToCatalog?: () => void
}) {
  const { cartItems, itemCount, totalInCents, removeItem, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const returnToCatalog = () => {
    setIsOpen(false)
    if (onReturnToCatalog) {
      onReturnToCatalog()
      return
    }
    window.location.assign('/#catalog')
  }

  const totalInDollars = (totalInCents / 100).toFixed(2)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="cart-drawer"
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-7 sm:left-7"
        aria-label={itemCount > 0 ? `Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : 'Open cart'}
      >
        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
        {itemCount > 0 && (
          <span
            key={itemCount}
            className="motion-badge-pop absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground"
          >
            {itemCount}
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <div
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        // `inert` keeps the off-screen panel out of the tab order and the
        // accessibility tree while it is closed.
        inert={!isOpen}
        className={`fixed bottom-0 right-0 z-50 h-screen w-full max-w-md bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Shopping cart</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" onClick={returnToCatalog} className="min-h-11">
                  <ArrowLeft className="h-4 w-4" />
                  Return to catalog
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => {
                  const atStockLimit = item.quantity >= item.stock
                  return (
                    <li key={item.id} className="motion-item-in flex gap-3 rounded-lg border border-border p-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${(item.priceInCents / 100).toFixed(2)} each
                        </p>
                        {atStockLimit && (
                          <p className="mt-1 text-xs text-amber-700">
                            All {item.stock} available {item.stock === 1 ? 'unit' : 'units'} in cart
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center font-medium" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={atStockLimit}
                            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="rounded-lg p-1 text-destructive transition-colors hover:bg-destructive/10"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalInDollars}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and any applicable taxes are calculated at checkout.
              </p>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${totalInDollars}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setIsOpen(false)
                  onCheckout()
                }}
                disabled={cartItems.length === 0}
                className="min-h-12 w-full"
              >
                Proceed to checkout
              </Button>
              <Button variant="outline" onClick={returnToCatalog} className="min-h-11 w-full">
                <ArrowLeft className="h-4 w-4" />
                Return to catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
