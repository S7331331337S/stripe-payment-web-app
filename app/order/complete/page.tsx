import Link from 'next/link'
import type { Metadata } from 'next'
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock } from 'lucide-react'
import { ClearCartOnMount } from '@/components/clear-cart-on-mount'
import { getStripe } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Order status',
  robots: { index: false, follow: false },
}

// The session id arrives as a query parameter, so this page is always dynamic.
export const dynamic = 'force-dynamic'

type Outcome =
  | { kind: 'paid'; amount: string; email: string | null }
  | { kind: 'processing' }
  | { kind: 'unpaid' }
  | { kind: 'unknown' }

async function resolveOutcome(sessionId: string | undefined): Promise<Outcome> {
  if (!sessionId) return { kind: 'unknown' }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    const amount = ((session.amount_total ?? 0) / 100).toFixed(2)
    const email = session.customer_details?.email ?? null

    switch (session.payment_status) {
      case 'paid':
      case 'no_payment_required':
        return { kind: 'paid', amount, email }
      case 'unpaid':
        return session.status === 'open' ? { kind: 'unpaid' } : { kind: 'processing' }
      default:
        return { kind: 'processing' }
    }
  } catch (error) {
    console.error('[order-complete] could not retrieve session', error)
    return { kind: 'unknown' }
  }
}

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const outcome = await resolveOutcome(sessionId)

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground sm:px-8">
      <div className="w-full max-w-xl rounded-[2rem] border border-border/80 bg-card/80 p-8 text-center shadow-[0_24px_70px_-30px_rgba(42,54,92,0.35)] backdrop-blur-xl sm:p-12">
        {outcome.kind === 'paid' && <ClearCartOnMount />}

        {outcome.kind === 'paid' ? (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden="true" />
            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
              Thank you for your order.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              We received your payment of{' '}
              <span className="font-semibold text-foreground">${outcome.amount}</span>.
              {outcome.email ? (
                <>
                  {' '}
                  A Stripe receipt is on its way to{' '}
                  <span className="font-medium text-foreground">{outcome.email}</span>.
                </>
              ) : null}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              We will follow up with dispatch details shortly.
            </p>
          </>
        ) : outcome.kind === 'processing' ? (
          <>
            <Clock className="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
              Your payment is processing.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Some payment methods take a little longer to settle. You will receive a Stripe receipt by email
              as soon as it clears — there is nothing else you need to do.
            </p>
          </>
        ) : outcome.kind === 'unpaid' ? (
          <>
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" aria-hidden="true" />
            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
              This order was not completed.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              No payment was taken and your cart has been kept. You can head back to the catalog and check out
              again whenever you are ready.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" aria-hidden="true" />
            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
              We could not find that order.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              If you completed a payment, your Stripe receipt is the confirmation of record. Reply to it and we
              will look into it.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-9 inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the catalog
        </Link>
      </div>
    </main>
  )
}
