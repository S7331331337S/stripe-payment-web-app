'use server'

import { getStripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { getSiteUrl } from '@/lib/site'

export interface CheckoutLineInput {
  productId: string
  quantity: number
}

export type CheckoutSessionResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string }

const MAX_LINE_ITEMS = 20

/**
 * Creates an embedded Checkout Session for the given cart.
 *
 * Pricing, availability, and totals are resolved from the server-side catalog —
 * the client only sends product ids and quantities, so a tampered cart cannot
 * change what is charged.
 *
 * Errors are returned rather than thrown: Next.js replaces thrown Server Action
 * errors with an opaque digest in production, which would leave the checkout UI
 * unable to tell the customer what went wrong.
 */
export async function startCheckoutSession(items: CheckoutLineInput[]): Promise<CheckoutSessionResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'Your cart is empty.' }
  }
  if (items.length > MAX_LINE_ITEMS) {
    return { ok: false, error: `Checkout supports up to ${MAX_LINE_ITEMS} distinct products at a time.` }
  }

  const lineItems = []
  const summary: string[] = []

  for (const { productId, quantity } of items) {
    const product = PRODUCTS.find((candidate) => candidate.id === productId)
    if (!product) {
      return { ok: false, error: 'One of the items in your cart is no longer available.' }
    }
    if (product.stock < 1) {
      return { ok: false, error: `${product.name} is currently out of stock.` }
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, error: `Please choose a valid quantity for ${product.name}.` }
    }
    if (quantity > product.stock) {
      return {
        ok: false,
        error: `Only ${product.stock} ${product.stock === 1 ? 'unit' : 'units'} of ${product.name} remain.`,
      }
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: product.name, description: product.description },
        unit_amount: product.priceInCents,
      },
      quantity,
    })
    summary.push(`${product.id}x${quantity}`)
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      // `embedded_page` replaced `embedded` in API version 2026-03-25.dahlia
      // (stripe-node v21+). On stripe-node v20 or older, use `embedded`.
      ui_mode: 'embedded_page',
      mode: 'payment',
      line_items: lineItems,
      // `if_required` keeps the flow inside the modal for card payments while
      // still allowing redirect-based methods, which `never` would disable.
      redirect_on_completion: 'if_required',
      return_url: `${getSiteUrl()}/order/complete?session_id={CHECKOUT_SESSION_ID}`,
      customer_creation: 'always',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      phone_number_collection: {
        enabled: true,
      },
      // Read back by the webhook handler so fulfilment knows what was ordered.
      metadata: { cart: summary.join(',').slice(0, 500) },
    })

    if (!session.client_secret) {
      return { ok: false, error: 'Stripe did not return a checkout session. Please try again.' }
    }

    return { ok: true, clientSecret: session.client_secret }
  } catch (error) {
    // Log Stripe's structured fields, not just the message. `type`/`code` are
    // what distinguish a transient failure from a misconfigured account — most
    // importantly `You cannot currently make live charges`, which means the
    // Stripe account has live keys but has not finished activation. No Stripe
    // internals are ever returned to the customer.
    const stripeError = error as {
      type?: string
      code?: string
      statusCode?: number
      message?: string
    }
    console.error('[checkout] failed to create session', {
      type: stripeError.type,
      code: stripeError.code,
      statusCode: stripeError.statusCode,
      message: stripeError.message,
    })

    if (stripeError.message?.includes('cannot currently make live charges')) {
      console.error(
        '[checkout] ACTION REQUIRED: this Stripe account is not activated for live charges. ' +
          'Complete activation at https://dashboard.stripe.com/account/onboarding, ' +
          'or set test keys (sk_test_… / pk_test_…) until it is.',
      )
    }

    return {
      ok: false,
      error: 'We could not start checkout right now. Please try again in a moment.',
    }
  }
}
