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
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: lineItems,
      mode: 'payment',
      customer_creation: 'always',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      phone_number_collection: {
        enabled: true,
      },
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
