'use client'

import { X } from 'lucide-react'
import Checkout from './checkout'

interface CheckoutModalProps {
  items: { productId: string; quantity: number }[]
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ items, isOpen, onClose }: CheckoutModalProps) {
  if (!isOpen || !items.length) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between border-b border-slate-200/80 px-4 py-3">
        <h2 className="text-lg font-semibold tracking-tight">Checkout</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Close checkout"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <Checkout items={items} />
      </div>
    </div>
  )
}
