# Stripe Integration TODO

This file is the single source of truth for remaining Stripe Checkout setup.

Checkout uses **Hosted Stripe Checkout** (`ui_mode: hosted_page`). The customer is redirected to `session.url`. The Stripe Node SDK is `stripe@^22.6.2`, so `hosted_page` is the correct `ui_mode`.

Catalog products and one-time prices were created with the Stripe CLI. Each price uses lookup key `catalog_<productId>` (for example `catalog_bpc157`). Checkout resolves those keys at session create time, so the same app code works in test or live after you sync the catalog to that Stripe account.

## Values to Replace

No Checkout Session placeholders remain in code. Success and cancel URLs are built from the incoming request host.

If you switch Stripe accounts, re-run the catalog sync so the lookup keys exist there:

```bash
./scripts/sync-stripe-catalog.sh
```

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [app/actions/stripe.ts](app/actions/stripe.ts)

| Parameter | Value |
|-----------|-------|
| ui_mode | hosted_page |
| mode | payment |
| billing_address_collection | auto |
| phone_number_collection.enabled | false |
| automatic_tax.enabled | false |
| allow_promotion_codes | false |
| submit_type | auto |
| integration_identifier | hosted_web_0008 |
| origin_context | web |
| line_items[].price | Stripe Price IDs from lookup key `catalog_<id>` |

`payment_method_collection` is omitted because `mode` is `"payment"`.

## Setup and next steps

### Environment variables

| Variable | Used in | Notes |
|----------|---------|-------|
| `STRIPE_SECRET_KEY` | [lib/stripe.ts](lib/stripe.ts) | Server-only. Local env now uses the Stripe CLI sandbox test key. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | leftover client Stripe.js usage if any | Browser-accessible Next.js public key. |
| `STRIPE_PUBLISHABLE_KEY` | `.env.local` alias | Same publishable key. |
| `STRIPE_LIVE_SECRET_KEY` | `.env.local` backup | Previous live secret. Live charges are currently blocked on that account. |
| `STRIPE_LIVE_PUBLISHABLE_KEY` | `.env.local` backup | Previous live publishable key. |

Do not commit `.env.local`.

The local sandbox was created with `stripe sandbox create`. Claim it before it expires (`stripe sandbox claim`) if you want to keep that test account.

Recommended for production: a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys).

### Project structure

| File | Purpose |
|------|---------|
| [app/actions/stripe.ts](app/actions/stripe.ts) | Creates a Hosted Checkout Session |
| [components/checkout.tsx](components/checkout.tsx) | Redirects to `session.url` |
| [app/success/page.tsx](app/success/page.tsx) | Post-payment return page |
| [scripts/sync-stripe-catalog.sh](scripts/sync-stripe-catalog.sh) | Creates/updates CLI products and prices |
| [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md) | Remaining setup |

### How the integration works

1. Customer adds catalog items and taps **Checkout securely**.
2. `startCheckoutSession` looks up Stripe prices by `catalog_<id>` and creates a Hosted Checkout Session.
3. The browser redirects to Stripe (`checkout.stripe.com`).
4. Success returns to `/success?session_id={CHECKOUT_SESSION_ID}`. Cancel returns to `/`.

### Testing

Use the sandbox test keys currently in `.env.local` and these cards:

| Card | Number | Result |
|------|--------|--------|
| Success | 4242424242424242 | Payment succeeds |
| Decline | 4000000000000002 | Card declined |
| 3D Secure | 4000002500003155 | Authentication required |

Use any future expiry, any 3-digit CVC, and any ZIP. More cases: https://docs.stripe.com/testing

The live Stripe account still cannot make live charges. Keep using the sandbox until that account can.

### Next steps

1. Claim the sandbox: `stripe sandbox claim`.
2. Add a webhook for `checkout.session.completed` if you need fulfillment or inventory updates.
3. When the live account can charge, run `./scripts/sync-stripe-catalog.sh` against live keys and point production env vars at that account.
4. Add order tracking if you need a durable paid-session record.

### Resources

- Stripe support: https://support.stripe.com
- Stripe docs MCP: https://docs.stripe.com/mcp
- Checkout Sessions: https://docs.stripe.com/api/checkout/sessions
- Stripe CLI: https://docs.stripe.com/stripe-cli
- Go-live checklist: https://docs.stripe.com/get-started/checklist/go-live
