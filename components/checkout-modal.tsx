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
    <>
      <div className="fixed inset-0 z-40 bg-black/50 motion-item-in" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="motion-sheet-in w-full max-h-[90vh] overflow-hidden rounded-t-lg bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-muted"
              aria-label="Close checkout"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
            <Checkout items={items} />
          </div>
        </div>
      </div>
    </>
  )
}
