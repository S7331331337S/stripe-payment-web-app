import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check, ShieldCheck } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ProductMark } from '@/components/product-mark'
import { RelatedProducts } from '@/components/related-products'
import { formatPrice, getRelatedProducts, isLowStock, splitBenefits, stockBadgeClass, stockLabel } from '@/lib/catalog'
import { PRODUCTS } from '@/lib/products'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }))
}

// Every product is known at build time, so anything else is a 404.
export const dynamicParams = false

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  if (!product) notFound()

  const benefits = splitBenefits(product.benefits)
  const related = getRelatedProducts(product)
  const lowStock = isLowStock(product.stock)

  return (
    <article className="pt-5">
      <p className="reveal-load text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Detail sheet</p>
      <div className="mt-3 flex items-start gap-3">
        <ProductMark product={product} size="lg" />
        <h1 className="reveal-clip font-mono text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">
          <span className="reveal-clip-inner" style={{ animationDelay: '80ms' }}>
            {product.name}
          </span>
        </h1>
      </div>
      <p className="reveal-load mt-3 text-sm leading-6 text-muted-foreground" style={{ animationDelay: '180ms' }}>
        {product.description}
      </p>

      <div className="mt-5 rounded-3xl border border-border/80 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-5 dark:from-indigo-950 dark:via-card dark:to-sky-950">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Current availability</p>
            <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-foreground">${formatPrice(product.priceInCents)}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockBadgeClass(product.stock)}`}>
            {stockLabel(product.stock)}
          </span>
        </div>
        {lowStock ? (
          <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">Limited remaining stock. Quantity is capped at what is available.</p>
        ) : null}
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Catalog notes</h2>
        <ul className="mt-3 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-foreground/80">
              <Check className="h-4 w-4 text-brand" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-muted/40 bg-brand-soft/70 p-5">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <h2 className="mt-3 font-semibold text-foreground">Handled with care</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This catalog is for research use only. Review all handling, storage, and compliance requirements before ordering.
        </p>
        {product.infoLink ? (
          <Link
            href={product.infoLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-brand"
          >
            Read the research note
          </Link>
        ) : null}
      </div>

      <RelatedProducts products={related} />
    </article>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  if (!product) return { title: 'Product not found' }

  // The brand suffix comes from the title template in app/layout.tsx, so the
  // name is not repeated here.
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.description,
      url: `/products/${product.id}`,
    },
  }
}
