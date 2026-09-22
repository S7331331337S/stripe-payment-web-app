import 'server-only'

import Stripe from 'stripe'

let client: Stripe | null = null

/**
 * Lazily constructed Stripe client.
 *
 * Constructing on first use (rather than at module load) keeps `next build`
 * working without secrets present, while still failing loudly at request time
 * if the key was never configured — instead of silently issuing requests with
 * an empty key and surfacing an opaque 401 from Stripe.
 */
export function getStripe(): Stripe {
  if (client) return client

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example) or to your hosting provider’s environment variables.',
    )
  }

  client = new Stripe(secretKey, {
    appInfo: { name: "G's Stock", url: 'https://github.com/S7331331337S/stripe-payment-web-app' },
  })
  return client
}
