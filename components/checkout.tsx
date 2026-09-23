'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getProductById } from '@/lib/catalog'
import { startCheckoutSession } from '../app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

export default function Checkout({
  items,
  onComplete,
  onClose,
  onReturnToCatalog,
}: {
  items: { productId: string; quantity: number }[]
  onComplete?: () => void
  onClose?: () => void
  onReturnToCatalog?: () => void
}) {
  const [orderItems] = useState(items)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [complete, setComplete] = useState(false)
  const [retryToken, setRetryToken] = useState(0)

  const recapItems = useMemo(
    () =>
      orderItems.flatMap((item) => {
        const product = getProductById(item.productId)
        return product ? [{ ...product, quantity: item.quantity }] : []
      }),
    [orderItems],
  )
  const recapTotal = recapItems.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)

  useEffect(() => {
    let active = true
    setClientSecret(null)
    setError(null)
    startCheckoutSession(orderItems)
      .then((result) => {
        if (!active) return
        if ('error' in result && result.error) {
          setError(result.error)
          return
        }
        setClientSecret(result.clientSecret ?? null)
      })
      .catch(() => {
        if (active) setError('Checkout could not start. Please try again.')
      })
    return () => {
      active = false
    }
  }, [orderItems, retryToken])

  const handleComplete = useCallback(() => {
    setComplete(true)
    onComplete?.()
  }, [onComplete])

  if (complete) {
    return (
      <div className="space-y-5 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Order received</p>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">Checkout complete</h3>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">
          Your research supply order is confirmed. A Stripe receipt will follow with shipping details.
        </p>
        <ul className="space-y-2 rounded-2xl border border-border/80 bg-card/80 p-4">
          {recapItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-slate-800">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-slate-950">${formatPrice(item.priceInCents * item.quantity)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between border-t border-border pt-2 text-sm font-semibold">
            <span>Total</span>
            <span>${formatPrice(recapTotal)}</span>
          </li>
        </ul>
        <Button onClick={onReturnToCatalog ?? onClose} className="h-12 w-full rounded-2xl bg-slate-950 text-white">
          Return to catalog
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 p-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Checkout</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Could not start checkout</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
        </div>
        <div className="space-y-2">
          <Button onClick={() => setRetryToken((value) => value + 1)} className="h-12 w-full rounded-2xl bg-slate-950 text-white">
            Try again
          </Button>
          <Button variant="outline" onClick={onClose} className="h-12 w-full rounded-2xl">
            Close
          </Button>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return <div className="p-6 text-sm text-muted-foreground">Preparing secure checkout…</div>
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
          onComplete: handleComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
