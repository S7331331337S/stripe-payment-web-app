'use server'

import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'

export async function startCheckoutSession(items: { productId: string; quantity: number }[]) {
  if (!items.length) throw new Error('Cart is empty')

  const lineItems = items.map(({ productId, quantity }) => {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) throw new Error(`Product with id "${productId}" not found`)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      throw new Error(`Invalid quantity for ${product.name}`)
    }
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: product.name, description: product.description },
        unit_amount: product.priceInCents,
      },
      quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    // `embedded_page` replaced `embedded` in API version 2026-03-25.dahlia
    // (stripe-node v21+). On stripe-node v20 or older, use `embedded`.
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
  })

  return session.client_secret
}
