import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  // Keep preview deployments out of search results.
  const isProduction = Boolean(process.env.NEXT_PUBLIC_SITE_URL) || process.env.VERCEL_ENV === 'production'

  return {
    rules: isProduction
      ? [{ userAgent: '*', allow: '/', disallow: ['/api/', '/order/'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
