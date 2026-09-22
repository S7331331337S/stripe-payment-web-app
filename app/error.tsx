'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[storefront] unhandled error', error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-16 text-foreground sm:px-8">
      <div className="w-full max-w-lg text-center">
        <AlertTriangle className="mx-auto h-9 w-9 text-amber-600" aria-hidden="true" />
        <h1 className="mt-6 font-serif text-4xl tracking-[-0.03em] text-slate-950">
          Something went wrong on our side.
        </h1>
        <p className="mt-5 text-sm leading-6 text-slate-600">
          No payment was taken. Try again, and if it keeps happening please get in touch.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-slate-400">Reference: {error.digest}</p>
        )}
        <Button className="mt-8 min-h-11" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
        </Button>
      </div>
    </main>
  )
}
