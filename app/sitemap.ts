import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/lib/products'
import { getSiteUrl } from '@/lib/site'

// Static informational pages. Stripe expects these reachable from the
// storefront, so they belong in the sitemap alongside the catalog.
const INFO_PATHS = ['/terms', '/privacy', '/shipping', '/contact']

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  return [
    { url: siteUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...PRODUCTS.map((product) => ({
      url: `${siteUrl}/products/${product.id}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...INFO_PATHS.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ]
}
