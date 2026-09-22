'use client'

import { useEffect, useState } from 'react'

import { startCheckoutSession } from '../app/actions/stripe'

export default function Checkout({ items }: { items: { productId: string; quantity: number }[] }) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setError(null)

    startCheckoutSession(items)
      .then((result) => {
        if (!active) return
        if ('error' in result) {
          setError(result.error)
          return
        }
        if (typeof result.url !== 'string' || result.url.length === 0) {
          setError('Checkout could not be started. Please try again.')
          return
        }
        window.location.assign(result.url)
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

  return <div className="p-6 text-sm text-muted-foreground">Redirecting to secure checkout…</div>
}
