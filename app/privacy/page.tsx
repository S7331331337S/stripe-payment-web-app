import type { Metadata } from 'next'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: "Privacy | Mstrmnd",
  description: "How Mstrmnd handles cart data, checkout, and catalog questions.",
}

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Policy" title="Privacy">
      <p>This site keeps your cart on this device so you can leave and return without losing items. That cart data stays in your browser unless you clear it or complete checkout.</p>
      <p>When you check out, Stripe collects payment, shipping, and contact details. Mstrmnd does not store card numbers on this site. Stripe&apos;s privacy policy covers that checkout data.</p>
      <p>If you use Ask, your questions and the catalog context are sent to the product concierge so it can answer. Do not send personal, payment, or health information in that chat.</p>
      <p>We use Vercel Analytics in production to understand aggregate visits. We do not sell catalog or checkout data.</p>
    </InfoPage>
  )
}
