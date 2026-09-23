import { PRODUCTS, type Product } from '@/lib/products'

export const LOW_STOCK_THRESHOLD = 3

export const CATALOG_CATEGORIES = [
  { id: 'healing', label: 'Healing', keywords: ['healing', 'tendons', 'joints', 'gut', 'injury', 'tissue', 'flexibility'] },
  { id: 'weight', label: 'Weight', keywords: ['weight', 'fat', 'appetite', 'metabolism'] },
  { id: 'energy', label: 'Energy', keywords: ['energy', 'endurance', 'exercise', 'dna'] },
  { id: 'beauty', label: 'Beauty', keywords: ['hair', 'skin', 'nails', 'beauty', 'tanning'] },
  { id: 'muscle', label: 'Muscle', keywords: ['muscle', 'growth hormone'] },
  { id: 'immune', label: 'Immune', keywords: ['immune', 'viral'] },
  { id: 'longevity', label: 'Longevity', keywords: ['anti-aging', 'youth'] },
] as const

export type CatalogCategoryId = (typeof CATALOG_CATEGORIES)[number]['id']

export function splitBenefits(benefits: string) {
  return benefits
    .split(',')
    .map((benefit) => benefit.trim())
    .filter(Boolean)
}

export function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toFixed(2)
}

const PRODUCT_MARKS = [
  'from-indigo-200 to-sky-100 text-indigo-900 dark:from-indigo-400/25 dark:to-sky-400/15 dark:text-indigo-100',
  'from-violet-200 to-indigo-100 text-violet-900 dark:from-violet-400/25 dark:to-indigo-400/15 dark:text-violet-100',
  'from-sky-200 to-cyan-100 text-sky-900 dark:from-sky-400/25 dark:to-cyan-400/15 dark:text-sky-100',
  'from-emerald-100 to-teal-100 text-emerald-900 dark:from-emerald-400/20 dark:to-teal-400/15 dark:text-emerald-100',
  'from-amber-100 to-orange-100 text-amber-900 dark:from-amber-400/20 dark:to-orange-400/15 dark:text-amber-100',
  'from-rose-100 to-indigo-100 text-rose-900 dark:from-rose-400/20 dark:to-indigo-400/15 dark:text-rose-100',
] as const

export function productInitials(name: string) {
  const base = name.replace(/\s+\d+\s*mg$/i, '').replace(/[^A-Za-z0-9+/ ]/g, '').trim()
  const tokens = base.split(/[\s/]+/).filter(Boolean)
  const first = tokens[0] ?? 'GS'
  if (tokens.length >= 2 && tokens[1]) return `${first[0] ?? ''}${tokens[1][0] ?? ''}`.toUpperCase()
  if (/^[A-Za-z]+\d+$/.test(first)) return first.slice(0, 3).toUpperCase()
  return first.slice(0, 3).toUpperCase()
}

export function productMarkClass(id: string) {
  const hash = [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return PRODUCT_MARKS[hash % PRODUCT_MARKS.length]
}

export function isLowStock(stock: number) {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD
}

export function stockLabel(stock: number) {
  if (stock <= 0) return 'Unavailable'
  if (isLowStock(stock)) return `${stock} left`
  return 'In stock'
}

export function stockToneClass(stock: number) {
  if (stock <= 0) return 'text-red-600 dark:text-red-400'
  if (isLowStock(stock)) return 'text-amber-700 dark:text-amber-400'
  return 'text-emerald-700 dark:text-emerald-400'
}

export function stockBadgeClass(stock: number) {
  if (stock <= 0) return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
  if (isLowStock(stock)) return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
  return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
}

export function productSearchText(product: Product) {
  return `${product.name} ${product.description} ${product.benefits}`.toLowerCase()
}

export function matchesCategory(product: Product, categoryId: CatalogCategoryId) {
  const category = CATALOG_CATEGORIES.find((item) => item.id === categoryId)
  if (!category) return false
  const haystack = productSearchText(product)
  return category.keywords.some((keyword) => haystack.includes(keyword))
}

export function filterCatalog(
  products: Product[],
  query: string,
  categoryId: CatalogCategoryId | 'all',
) {
  const normalized = query.trim().toLowerCase()
  return products.filter((product) => {
    const matchesQuery = !normalized || productSearchText(product).includes(normalized)
    const matchesSelectedCategory = categoryId === 'all' || matchesCategory(product, categoryId)
    return matchesQuery && matchesSelectedCategory
  })
}

export function getRelatedProducts(product: Product, limit = 3) {
  const sourceBenefits = new Set(splitBenefits(product.benefits).map((benefit) => benefit.toLowerCase()))

  return PRODUCTS.filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const overlap = splitBenefits(candidate.benefits).filter((benefit) =>
        sourceBenefits.has(benefit.toLowerCase()),
      ).length
      return { candidate, overlap }
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || a.candidate.name.localeCompare(b.candidate.name))
    .slice(0, limit)
    .map((item) => item.candidate)
}

export function getProductById(id: string) {
  return PRODUCTS.find((product) => product.id === id)
}

const PRODUCT_MENTION_PATTERN = new RegExp(
  `\\b(${PRODUCTS.map((product) => product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi',
)

export function linkifyCatalogMentions(text: string) {
  const parts: Array<{ type: 'text' | 'link'; text: string; href?: string }> = []
  const markdownLink = /\[([^\]]+)\]\((\/products\/[a-z0-9-]+)\)/gi
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = markdownLink.exec(text))) {
    if (match.index > cursor) {
      parts.push(...splitMentions(text.slice(cursor, match.index)))
    }
    parts.push({ type: 'link', text: match[1], href: match[2] })
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) {
    parts.push(...splitMentions(text.slice(cursor)))
  }

  return parts.length ? parts : [{ type: 'text' as const, text }]
}

function splitMentions(text: string) {
  const parts: Array<{ type: 'text' | 'link'; text: string; href?: string }> = []
  let cursor = 0
  let match: RegExpExecArray | null
  const pattern = new RegExp(PRODUCT_MENTION_PATTERN.source, 'gi')

  while ((match = pattern.exec(text))) {
    const current = match
    if (current.index > cursor) {
      parts.push({ type: 'text', text: text.slice(cursor, current.index) })
    }
    const mention = current[0]
    const mentioned = PRODUCTS.find((product) => product.name.toLowerCase() === mention.toLowerCase())
    if (mentioned) {
      parts.push({ type: 'link', text: mention, href: `/products/${mentioned.id}` })
    } else {
      parts.push({ type: 'text', text: mention })
    }
    cursor = current.index + mention.length
  }

  if (cursor < text.length) {
    parts.push({ type: 'text', text: text.slice(cursor) })
  }

  return parts
}
