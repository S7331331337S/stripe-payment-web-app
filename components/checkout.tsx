'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { startCheckoutSession, type CheckoutLineInput } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Loaded once per page, not per render — loadStripe is memoised by Stripe.js but
// the promise identity matters to EmbeddedCheckoutProvider. The rejection is
// absorbed here (resolving to null) so a blocked or offline Stripe.js becomes a
// message in the checkout panel instead of an unhandled promise rejection.
const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey).catch((error: unknown) => {
      console.error('[checkout] Stripe.js failed to load', error)
      return null
    })
  : null

type Status =
  | { state: 'loading' }
  | { state: 'ready'; clientSecret: string }
  | { state: 'error'; message: string }

export default function Checkout({
  items,
  onComplete,
}: {
  items: CheckoutLineInput[]
  onComplete?: () => void
}) {
  const [status, setStatus] = useState<Status>({ state: 'loading' })
  const [attempt, setAttempt] = useState(0)

  // `items` is rebuilt on every parent render, so depending on it directly would
  // create a new Stripe session each time. Key the effect on cart *contents*.
  const cartKey = useMemo(
    () =>
      items
        .map(({ productId, quantity }) => `${productId}:${quantity}`)
        .sort()
        .join('|'),
    [items],
  )

  useEffect(() => {
    if (!stripePromise) {
      setStatus({
        state: 'error',
        message:
          'Checkout is not configured yet. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing from this deployment.',
      })
      return
    }

    let active = true
    setStatus({ state: 'loading' })

    Promise.all([stripePromise, startCheckoutSession(items)])
      .then(([stripe, result]) => {
        if (!active) return
        if (!stripe) {
          setStatus({
            state: 'error',
            message:
              'We could not load Stripe.js. Disable any script blockers for this site, then try again.',
          })
          return
        }
        setStatus(
          result.ok
            ? { state: 'ready', clientSecret: result.clientSecret }
            : { state: 'error', message: result.error },
        )
      })
      .catch(() => {
        if (!active) return
        setStatus({
          state: 'error',
          message: 'We could not reach the payment service. Please check your connection and try again.',
        })
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cartKey stands in for `items`
  }, [cartKey, attempt])

  const handleComplete = useCallback(() => onComplete?.(), [onComplete])

  if (status.state === 'loading') {
    return (
      <div className="flex items-center gap-3 p-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Preparing secure checkout…
      </div>
    )
  }

  if (status.state === 'error') {
    return (
      <div role="alert" className="p-6">
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">Checkout unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">{status.message}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setAttempt((current) => current + 1)}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        key={status.clientSecret}
        stripe={stripePromise}
        options={{ clientSecret: status.clientSecret, onComplete: handleComplete }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
