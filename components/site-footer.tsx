import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/contact', label: 'Contact' },
] as const

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-5">
      <nav aria-label="Policies" className="flex flex-wrap gap-x-4 gap-y-2">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center text-sm font-medium text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="pb-1 text-[11px] leading-5 text-muted-foreground">
        Research use only. Mstrmnd does not provide medical advice. Checkout is handled by Stripe.
      </p>
    </footer>
  )
}
