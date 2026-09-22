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

  // Escape closes, and the page behind the modal stops scrolling.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  if (!isComplete && items.length === 0) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-t-[1.5rem] bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 id="checkout-modal-title" className="text-lg font-semibold">
              {isComplete ? 'Order confirmed' : 'Complete your purchase'}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-68px)] overflow-y-auto">
            {isComplete ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-2xl tracking-tight text-foreground">
                  Thank you — your payment went through.
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  A Stripe receipt is on its way to the email you provided. We will follow up with dispatch
                  details for your order.
                </p>
                <Button className="mt-7" onClick={onClose}>
                  Back to the catalog
                </Button>
              </div>
            ) : (
              <Checkout items={items} onComplete={handleComplete} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
