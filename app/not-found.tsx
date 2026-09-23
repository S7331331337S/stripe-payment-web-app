import Link from 'next/link'

export default function NotFound() {
  return (
    <article className="pt-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Missing page</p>
      <h1 className="mt-2 max-w-[12ch] text-[2.2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
        This sheet is not in the catalog.
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
        The page you opened does not match a current compound or policy note. Browse the collection or return home.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/#catalog"
          className="inline-flex min-h-12 items-center rounded-2xl bg-foreground px-5 text-sm font-medium text-background"
        >
          Browse catalog
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-2xl border border-border bg-card px-5 text-sm font-medium text-foreground"
        >
          Home
        </Link>
      </div>
    </article>
  )
}
