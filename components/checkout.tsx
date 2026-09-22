'use client'

import { useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startCheckoutSession } from '../app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

export default function Checkout({ items }: { items: { productId: string; quantity: number }[] }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setError(null)
    setClientSecret(null)

    startCheckoutSession(items)
      .then((result) => {
        if (!active) return
        if ('error' in result) {
          setError(result.error)
          return
        }
        if (typeof result.clientSecret !== 'string' || result.clientSecret.length === 0) {
          setError('Checkout could not be started. Please try again.')
          return
        }
        setClientSecret(result.clientSecret)
      })
      .catch((caught: unknown) => {
        if (!active) return
        setError(caught instanceof Error ? caught.message : 'Checkout could not be started. Please try again.')
      })

    return () => {
      active = false
    }
  }, [items])

  if (error) {
    return <div className="p-6 text-sm text-destructive">{error}</div>
  }

  if (!clientSecret) {
    return <div className="p-6 text-sm text-muted-foreground">Preparing secure checkout…</div>
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
