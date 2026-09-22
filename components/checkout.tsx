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

  useEffect(() => {
    let active = true
    startCheckoutSession(items).then((secret) => {
      if (active) setClientSecret(secret)
    })
    return () => {
      active = false
    }
  }, [items])

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
