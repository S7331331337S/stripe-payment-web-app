import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react'
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
    <main className="min-h-screen bg-background px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-[0_24px_70px_-30px_rgba(42,54,92,0.35)] backdrop-blur-xl sm:p-10">
          <div className="mb-10 flex items-center justify-between border-b border-slate-200/80 pb-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">G&apos;s Stock / Detail sheet</div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Research catalog</div>
          </div>
          <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Compound profile</p>
              <h1 className="font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-7xl">{product.name}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{product.description}</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current availability</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">${price}</p>
              <p className="mt-2 text-sm text-emerald-700">{product.stock > 0 ? `${product.stock} units available` : 'Currently unavailable'}</p>
              <div className="mt-5"><AddToCartButton product={product} /></div>
            </div>
          </div>
          <div className="mt-12 grid gap-8 border-t border-slate-200/80 pt-8 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Catalog notes</h2>
              <ul className="mt-4 space-y-3">
                {benefits.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-slate-700"><Check className="h-4 w-4 text-indigo-600" /> {benefit}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
              <ShieldCheck className="h-5 w-5 text-indigo-700" />
              <h2 className="mt-4 font-semibold text-slate-900">Handled with care</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">This catalog is for research use only. Review all handling, storage, and compliance requirements before ordering.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS.find((item) => item.id === id)
  return { title: product ? `${product.name} | G's Stock` : 'Product | G\'s Stock' }
}
 
