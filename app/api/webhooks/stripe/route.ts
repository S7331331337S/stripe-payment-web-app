import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

// Signature verification needs the raw request body, so this route must run on
// Node and must never be statically optimised.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Stripe webhook receiver.
 *
 * This is the authoritative signal that a payment succeeded — the browser can be
 * closed before the embedded checkout finishes, so fulfilment must not depend on
 * the client reporting back. Wire order creation, stock decrement, and
 * notifications into `handleCheckoutCompleted` below.
 *
 * Local testing:  stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set; rejecting delivery')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, webhookSecret)
  } catch (error) {
    // A verification failure means the payload is not from Stripe — or the
    // secret is wrong. Either way, never process it.
    console.error('[stripe-webhook] signature verification failed', error)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutCompleted(event.data.object)
        break
      case 'checkout.session.async_payment_failed':
        console.warn('[stripe-webhook] async payment failed', { sessionId: event.data.object.id })
        break
      default:
        // Unhandled types are acknowledged so Stripe stops retrying them.
        break
    }
  } catch (error) {
    // Returning 500 tells Stripe to retry with backoff.
    console.error(`[stripe-webhook] handler failed for ${event.type}`, error)
    return new Response('Handler error', { status: 500 })
  }

  return Response.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status === 'unpaid') {
    console.warn('[stripe-webhook] session completed but still unpaid', { sessionId: session.id })
    return
  }

  // TODO(fulfilment): persist this order, decrement stock, and notify dispatch.
  // Stripe may deliver the same event more than once, so key any write on
  // `session.id` to keep it idempotent.
  console.info('[stripe-webhook] order paid', {
    sessionId: session.id,
    amountTotal: session.amount_total,
    currency: session.currency,
    email: session.customer_details?.email,
    cart: session.metadata?.cart,
  })
}
