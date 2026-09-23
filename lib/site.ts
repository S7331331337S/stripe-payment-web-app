/**
 * Canonical absolute base URL for the deployment.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL   — set this to your custom domain in production.
 *  2. VERCEL_PROJECT_PRODUCTION_URL — stable production host on Vercel.
 *  3. VERCEL_URL             — per-deployment preview host.
 *  4. localhost              — local development.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return stripTrailingSlash(withProtocol(explicit))

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (production) return `https://${stripTrailingSlash(production)}`

  const preview = process.env.VERCEL_URL
  if (preview) return `https://${stripTrailingSlash(preview)}`

  const port = process.env.PORT ?? '3000'
  return `http://localhost:${port}`
}

function withProtocol(value: string): string {
  return /^https?:\/\//.test(value) ? value : `https://${value}`
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '')
}

export const SITE_NAME = 'Mstrmnd'
export const SITE_DESCRIPTION =
  'A considered catalog of research compounds with clear detail sheets and secure Stripe checkout.'
