# Stripe Integration TODO

This file is the single source of truth for remaining Stripe Checkout setup.

Checkout uses **Hosted Stripe Checkout** (`ui_mode: hosted_page`). Customers are redirected to a Stripe-hosted payment page. The Stripe Node SDK in this project is `stripe@^22.6.2`, so `hosted_page` is the correct `ui_mode` (use `hosted` only on SDKs below 21.0.0).

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [app/actions/stripe.ts](app/actions/stripe.ts)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| success_url | https://example.com/success?session_id={CHECKOUT_SESSION_ID} | Your actual post-payment success page URL. Keep the `{CHECKOUT_SESSION_ID}` template. |
| cancel_url | https://example.com/cancel | Your actual cancel/return page URL. |

`mode` is already `"payment"` for this catalog’s one-time charges. Keep it unless you add subscriptions.

`line_items` already use real catalog products (`price_data` from [lib/products.ts](lib/products.ts)). Do not replace them with `price_...` placeholders.

`payment_method_collection` is omitted because `mode` is `"payment"`. Add it (value `always`) only if you switch `mode` to `"subscription"`.

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [app/actions/stripe.ts](app/actions/stripe.ts)

| Parameter | Value |
|-----------|-------|
| ui_mode | hosted_page |
| billing_address_collection | auto |
| phone_number_collection.enabled | false |
| automatic_tax.enabled | false |
| allow_promotion_codes | false |
| submit_type | auto |
| integration_identifier | hosted_web_0008 |
| origin_context | web |

## Setup and next steps

### Environment variables

Names used in code must match the env file. This project already uses:

| Variable | Used in | Notes |
|----------|---------|-------|
| `STRIPE_SECRET_KEY` | [lib/stripe.ts](lib/stripe.ts) | Server-only. Do not prefix with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [components/checkout.tsx](components/checkout.tsx) | Browser-accessible Next.js public key. |
| `STRIPE_PUBLISHABLE_KEY` | `.env.local` (optional alias) | Not referenced by code. Safe to drop or keep as a server-side alias. |

Create keys in the Stripe Dashboard: https://dashboard.stripe.com/apikeys

Recommended: use a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys) (`rk_`) in production instead of a secret key (`sk_`).

Do not commit `.env.local`.

### Project structure of new files

| File | Purpose |
|------|---------|
| [STRIPE_INTEGRATION_TODO.md](STRIPE_INTEGRATION_TODO.md) | Remaining setup steps (this file) |

No new routes or webhook handlers were added. Session creation already lives in [app/actions/stripe.ts](app/actions/stripe.ts).

### How the integration works

1. The customer adds catalog items and starts checkout.
2. `startCheckoutSession` in [app/actions/stripe.ts](app/actions/stripe.ts) creates a Checkout Session with Hosted Checkout (`ui_mode: hosted_page`).
3. Stripe returns a hosted Checkout URL for that session.
4. After payment, Stripe redirects the customer to `success_url`. If they cancel, Stripe redirects to `cancel_url`.

Replace the placeholder `success_url` and `cancel_url` before testing hosted redirect. Hosted Checkout does not use Embedded Checkout’s `client_secret` flow.

### Testing

Use test mode keys (`pk_test_…` / `sk_test_…` or a test restricted key) and these cards:

| Card | Number | Result |
|------|--------|--------|
| Success | 4242424242424242 | Payment succeeds |
| Decline | 4000000000000002 | Card declined |
| 3D Secure | 4000002500003155 | Authentication required |

Use any future expiry, any 3-digit CVC, and any ZIP. More cases: https://docs.stripe.com/testing

The live Stripe account may still reject charges if live payments are not enabled on the account.

### Next steps

1. Replace `success_url` and `cancel_url` in [app/actions/stripe.ts](app/actions/stripe.ts) with real app URLs.
2. Redirect the customer to `session.url` after session creation (Hosted Checkout). The current UI still expects an embedded `clientSecret`.
3. Confirm products in [lib/products.ts](lib/products.ts) match what you want to sell. Optionally create Prices in the Dashboard (https://dashboard.stripe.com/prices) if you later switch `line_items` to Price IDs.
4. Add fulfillment (email, inventory, order record) on `checkout.session.completed` via a webhook.
5. Add order tracking if you need a durable record of paid sessions.

### Resources

- Stripe support: https://support.stripe.com
- Stripe docs MCP: https://docs.stripe.com/mcp
- Checkout Sessions: https://docs.stripe.com/api/checkout/sessions
- Go-live checklist: https://docs.stripe.com/get-started/checklist/go-live
