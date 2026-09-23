import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, ShieldCheck } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { RelatedProducts } from '@/components/related-products'
import { formatPrice, getRelatedProducts, isLowStock, splitBenefits, stockLabel } from '@/lib/catalog'
import { PRODUCTS } from '@/lib/products'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }))
}

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
      <h1 className="reveal-clip mt-2 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950">
        <span className="reveal-clip-inner" style={{ animationDelay: '80ms' }}>
          {product.name}
        </span>
      </h1>
      <p className="reveal-load mt-3 text-sm leading-6 text-slate-600" style={{ animationDelay: '180ms' }}>
        {product.description}
      </p>

      <div className="mt-5 rounded-3xl border border-border/80 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current availability</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">${formatPrice(product.priceInCents)}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              product.stock === 0
                ? 'bg-red-50 text-red-700'
                : lowStock
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {stockLabel(product.stock)}
          </span>
        </div>
        {lowStock ? (
          <p className="mt-2 text-sm text-amber-800">Limited remaining stock. Quantity is capped at what is available.</p>
        ) : null}
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Catalog notes</h2>
        <ul className="mt-3 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="h-4 w-4 text-brand" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-muted/40 bg-brand-soft/70 p-5">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <h2 className="mt-3 font-semibold text-slate-900">Handled with care</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
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

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  return { title: product ? `${product.name} | G's Stock` : "Product | G's Stock" }
}
