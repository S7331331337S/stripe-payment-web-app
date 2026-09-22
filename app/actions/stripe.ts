'use server'

import { headers } from 'next/headers'
import { stripe } from '../../lib/stripe'
import { PRODUCTS, stripeCatalogLookupKey } from '../../lib/products'

export type CheckoutSessionResult =
  | { url: string }
  | { error: string }

async function getAppOrigin(): Promise<string> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  if (!host) return 'http://127.0.0.1:3000'
  const protocol =
    requestHeaders.get('x-forwarded-proto') ??
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https')
  return `${protocol}://${host}`
}

export async function startCheckoutSession(
  items: { productId: string; quantity: number }[],
): Promise<CheckoutSessionResult> {
  if (!items.length) return { error: 'Cart is empty' }

  for (const { productId, quantity } of items) {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) return { error: `Product with id "${productId}" not found` }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      return { error: `Invalid quantity for ${product.name}` }
    }
  }

  const lookupKeys = items.map(({ productId }) => stripeCatalogLookupKey(productId))
  const prices = await stripe.prices.list({
    lookup_keys: lookupKeys,
    active: true,
    limit: lookupKeys.length,
  })
  const priceByLookupKey = new Map(
    prices.data.flatMap((price) => (price.lookup_key ? [[price.lookup_key, price] as const] : [])),
  )

  const lineItems = []
  for (const { productId, quantity } of items) {
    const product = PRODUCTS.find((p) => p.id === productId)!
    const price = priceByLookupKey.get(stripeCatalogLookupKey(productId))
    if (!price) {
      return { error: `Stripe price missing for ${product.name}. Run scripts/sync-stripe-catalog.sh` }
    }
    lineItems.push({ price: price.id, quantity })
  }

  try {
    const origin = await getAppOrigin()
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'hosted_page',
      mode: 'payment',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
      automatic_tax: {
        enabled: false,
      },
      allow_promotion_codes: false,
      submit_type: 'auto',
      integration_identifier: 'hosted_web_0008',
      origin_context: 'web',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      line_items: lineItems,
    })

    if (typeof session.url !== 'string' || session.url.length === 0) {
      return { error: 'Stripe did not return a hosted checkout URL' }
    }

    return { url: session.url }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to start checkout'
    if (message.toLowerCase().includes('cannot currently make live charges')) {
      return { error: 'Checkout is temporarily unavailable. Please try again later.' }
    }
    return { error: message }
  }
}
