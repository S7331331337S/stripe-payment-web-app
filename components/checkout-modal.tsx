'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Checkout from './checkout'

interface CheckoutModalProps {
  items: { productId: string; quantity: number }[]
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
  onReturnToCatalog?: () => void
}

export function CheckoutModal({ items, isOpen, onClose, onComplete, onReturnToCatalog }: CheckoutModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // The page behind the sheet stops scrolling while it is open, and focus moves
  // into it. Escape is handled by AppShell, which owns the open state.
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen || !items.length) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="motion-sheet-in fixed inset-0 z-[60] flex flex-col bg-background pt-[env(safe-area-inset-top)]"
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-between border-b border-slate-200/80 px-4 py-3">
        <h2 id="checkout-modal-title" className="text-lg font-semibold tracking-tight">
          Checkout
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <Checkout items={items} onComplete={onComplete} onClose={onClose} onReturnToCatalog={onReturnToCatalog} />
      </div>
    </div>
  )
}
