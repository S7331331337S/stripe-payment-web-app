import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/lib/products'
import { getSiteUrl } from '@/lib/site'

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
  ]
}
