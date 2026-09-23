import type { Metadata } from 'next'
import Link from 'next/link'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: "Contact | Mstrmnd",
  description: "How to reach Mstrmnd about the catalog or an order.",
}

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Support" title="Contact">
      <p>For questions about compounds, stock, or what is in the catalog, use Ask in the app. The concierge answers from the current catalog only and will not give medical advice.</p>
      <p>For a placed order, use the receipt Stripe sends after checkout. That is the record of payment, shipping, and contact details.</p>
      <p>This catalog is for research use only. Please review the detail sheet and applicable handling requirements before you order.</p>
      <p>
        <Link href="/#catalog" className="font-medium text-brand">
          Return to the catalog
        </Link>
      </p>
    </InfoPage>
  )
}
