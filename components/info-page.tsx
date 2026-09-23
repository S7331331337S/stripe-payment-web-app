import type { ReactNode } from 'react'

export function InfoPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <article className="pt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      <h1 className="mt-2 text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground">{title}</h1>
      <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">{children}</div>
    </article>
  )
}
