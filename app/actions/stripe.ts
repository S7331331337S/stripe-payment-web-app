'use server'

import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'

export type CheckoutSessionResult =
  | { clientSecret: string }
  | { error: string }

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

  const lineItems = items.map(({ productId, quantity }) => {
    const product = PRODUCTS.find((p) => p.id === productId)!
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product.name, description: product.description },
        unit_amount: product.priceInCents,
      },
      quantity,
    }
  })

  try {
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
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
      line_items: lineItems,
    })

    if (typeof session.client_secret !== 'string' || session.client_secret.length === 0) {
      return { error: 'Stripe did not return a checkout client secret' }
    }

    return { clientSecret: session.client_secret }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to start checkout'
    if (message.toLowerCase().includes('cannot currently make live charges')) {
      return { error: 'Checkout is temporarily unavailable. Please try again later.' }
    }
    return { error: message }
  }
}
