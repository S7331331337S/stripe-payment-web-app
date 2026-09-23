# Mstrmnd — Stripe storefront

A Next.js 16 storefront for a small research-compound catalog, with Stripe
embedded checkout, a persistent cart, and an optional AI product concierge.

- **Catalog** — `lib/products.ts` is the single source of truth for names,
  prices, stock, and detail-sheet copy.
- **Checkout** — Stripe embedded Checkout in a modal. Prices and stock are
  always resolved server-side, so a tampered cart cannot change what is charged.
- **Fulfilment** — `/api/webhooks/stripe` is the authoritative "payment
  succeeded" signal.

## Requirements

- Node.js 20.9+
- pnpm 10+ (`corepack enable`)
- A Stripe account

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in your Stripe test keys
pnpm dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | yes | Server-side Stripe calls (checkout sessions, webhook verification). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | yes | Mounts Stripe embedded Checkout in the browser. |
| `STRIPE_WEBHOOK_SECRET` | yes in production | Verifies webhook signatures. The webhook route returns `500` without it. |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URLs, OpenGraph tags, sitemap, and the Checkout `return_url`. Inferred from `VERCEL_PROJECT_PRODUCTION_URL` on Vercel. |
| `AI_GATEWAY_API_KEY` | optional | Powers the product concierge chat. Without it (and off Vercel) the widget degrades gracefully. |

`NEXT_PUBLIC_*` values are inlined at build time — changing them on your host
requires a redeploy, not just a restart.

### Testing payments locally

Use Stripe [test cards](https://docs.stripe.com/testing) — `4242 4242 4242 4242`
with any future expiry and any CVC.

Forward webhooks to your dev server in a second terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed `whsec_…` value into `STRIPE_WEBHOOK_SECRET`.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server with Turbopack. |
| `pnpm build` | Production build. Type errors fail the build. |
| `pnpm start` | Serve the production build. |
| `pnpm typecheck` | `tsc --noEmit`. |

## Deploying to Vercel

1. Import the repository in Vercel.
2. Add every variable from the table above to **Settings → Environment
   Variables** (live `sk_live_…` / `pk_live_…` keys for Production).
3. Deploy, then add the production webhook endpoint at
   <https://dashboard.stripe.com/webhooks>:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`,
     `checkout.session.async_payment_succeeded`,
     `checkout.session.async_payment_failed`
4. Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.

## Before you take real money

> **Check first: is the Stripe account activated for live charges?**
> If session creation fails with `You cannot currently make live charges`, the
> account has live keys but has not finished activation. Complete it at
> <https://dashboard.stripe.com/account/onboarding>, or use test keys until it
> is done. The server logs call this case out explicitly; customers only ever
> see a generic "try again" message.

These are deliberate gaps, not oversights — each one needs a product decision:

- **Fulfilment is a log line.** `handleCheckoutCompleted` in
  `app/api/webhooks/stripe/route.ts` currently logs the paid order. Persist it,
  decrement stock, and notify dispatch there. Stripe can deliver the same event
  twice, so key any write on `session.id`.
- **Stock is static.** `lib/products.ts` is edited by hand and never decremented.
  Two people can buy the last unit at the same time. Move inventory to a
  database (or Stripe Products/Prices) before launch.
- **No shipping cost or tax.** A US shipping address and phone number are
  collected, but nothing is charged for delivery and Stripe Tax is not enabled.
  Add `shipping_options` and/or `automatic_tax` in
  `app/actions/stripe.ts` if you need them.
- **Chat rate limiting is per-instance.** The in-memory limiter in
  `app/api/product-chat/route.ts` does not coordinate across serverless
  instances. Use a shared store (Vercel KV, Upstash) for real traffic.
- **Policy pages.** Terms, privacy, refunds, and shipping policies are not in
  this repo. Stripe expects them to be reachable from your storefront, and they
  should be reviewed by someone qualified rather than generated.

## Project layout

```
app/
  actions/stripe.ts          Server action that creates the Checkout Session
  api/product-chat/route.ts  Concierge chat endpoint (validated + rate limited)
  api/webhooks/stripe/       Signed webhook receiver — wire fulfilment here
  order/complete/            Post-redirect order status page
  products/[id]/             Statically generated detail sheets
components/
  cart-provider.tsx          Cart state, localStorage persistence, stock clamping
  cart-drawer.tsx            Slide-over cart
  checkout-modal.tsx         Modal shell + post-payment confirmation
  checkout.tsx               Embedded Checkout with loading/error/retry states
lib/
  products.ts                Catalog
  stripe.ts                  Lazily constructed Stripe client
  site.ts                    Canonical base URL resolution
```
