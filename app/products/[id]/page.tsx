import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, ShieldCheck } from 'lucide-react'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { PRODUCTS } from '@/lib/products'

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ id: product.id }))
}

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  if (!product) notFound()

  const benefits = product.benefits.split(',').map((benefit) => benefit.trim())
  const price = (product.priceInCents / 100).toFixed(2)

  return (
    <article className="pt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-700">Detail sheet</p>
      <h1 className="mt-2 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950">{product.name}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>

      <div className="mt-5 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current availability</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">${price}</p>
        <p className="mt-1 text-sm text-emerald-700">
          {product.stock > 0 ? `${product.stock} units available` : 'Currently unavailable'}
        </p>
        <div className="mt-4">
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Catalog notes</h2>
        <ul className="mt-3 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 text-sm text-slate-700">
              <Check className="h-4 w-4 text-indigo-600" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
        <ShieldCheck className="h-5 w-5 text-indigo-700" />
        <h2 className="mt-3 font-semibold text-slate-900">Handled with care</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This catalog is for research use only. Review all handling, storage, and compliance requirements before ordering.
        </p>
        {product.infoLink ? (
          <Link
            href={product.infoLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-indigo-700"
          >
            Read the research note
          </Link>
        ) : null}
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  return { title: product ? `${product.name} | G's Stock` : "Product | G's Stock" }
}
