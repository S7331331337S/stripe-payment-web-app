'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

import Checkout from './checkout'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import type { CheckoutLineInput } from '@/app/actions/stripe'

interface CheckoutModalProps {
  items: CheckoutLineInput[]
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ items, isOpen, onClose }: CheckoutModalProps) {
  const { clearCart } = useCart()
  const [isComplete, setIsComplete] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleComplete = useCallback(() => {
    setIsComplete(true)
    clearCart()
  }, [clearCart])

  // Reset between openings so a new cart does not inherit the previous success state.
  useEffect(() => {
    if (!isOpen) setIsComplete(false)
  }, [isOpen])

  // The page behind the sheet stops scrolling while it is open. Escape is
  // handled by AppShell, which also owns the checkout open state.
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null
  // Once paid the cart is empty, so the success panel must not be gated on it.
  if (!isComplete && items.length === 0) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="motion-sheet-in fixed inset-0 z-[60] flex flex-col bg-background pt-[env(safe-area-inset-top)]"
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-between border-b border-slate-200/80 px-4 py-3">
        <h2 id="checkout-modal-title" className="text-lg font-semibold tracking-tight">
          {isComplete ? 'Order confirmed' : 'Checkout'}
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {isComplete ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
            <h3 className="mt-5 font-serif text-2xl tracking-tight text-foreground">
              Thank you — your payment went through.
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              A Stripe receipt is on its way to the email you provided. We will follow up with dispatch
              details for your order.
            </p>
            <Button className="mt-7 min-h-11" onClick={onClose}>
              Back to the catalog
            </Button>
          </div>
        ) : (
          <Checkout items={items} onComplete={handleComplete} />
        )}
      </div>
    </div>
  )
}
