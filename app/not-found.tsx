import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground sm:px-8">
      <div className="w-full max-w-lg text-center">
        <Compass className="mx-auto h-9 w-9 text-indigo-700" aria-hidden="true" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">404</p>
        <h1 className="mt-3 font-serif text-5xl tracking-[-0.04em] text-slate-950">
          This page is not in the catalog.
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          The compound or page you were looking for may have been renamed or is no longer stocked.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the catalog
        </Link>
      </div>
    </main>
  )
}
