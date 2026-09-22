import Link from 'next/link'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams

  return (
    <section className="flex min-h-[calc(100dvh-var(--app-chrome))] flex-col justify-center py-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Order received</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">Thank you.</h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground">
        Stripe confirmed the checkout session. A receipt will come from Stripe if payment completed.
      </p>
      {sessionId ? (
        <p className="mt-3 break-all text-xs text-muted-foreground">Session {sessionId}</p>
      ) : null}
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background"
      >
        Back to catalog
      </Link>
    </section>
  )
}
