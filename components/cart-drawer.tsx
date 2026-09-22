'use client'

import { useState } from 'react'
import { ShoppingCart, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products'

interface CartItem extends Product {
  quantity: number
}

interface CartDrawerProps {
  items: CartItem[]
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onCheckout: () => void
}

export function CartDrawer({ items, onRemoveItem, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const total = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)
  const totalInDollars = (total / 100).toFixed(2)

  const toggleDrawer = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        onClick={toggleDrawer}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
        aria-label="Open cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
            {items.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={toggleDrawer} aria-hidden="true" />
      )}

      <div
        className={`fixed bottom-0 right-0 z-50 h-screen w-full max-w-md bg-card shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={toggleDrawer}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ${(item.priceInCents / 100).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="rounded px-2 py-1 hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="rounded px-2 py-1 hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="rounded p-1 text-destructive hover:bg-destructive/10"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">${totalInDollars}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">${totalInDollars}</span>
              </div>
            </div>
            <Button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
