import type { Metadata } from 'next'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: "Shipping | G's Stock",
  description: "Shipping, packing, and delivery notes for G's Stock orders.",
}

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Policy" title="Shipping">
      <p>Orders ship to addresses in the United States. Stripe collects the shipping address and phone number during checkout.</p>
      <p>Dispatch is discreet: plain packaging, no catalog branding on the outside, packed with care for research materials.</p>
      <p>Most in-stock orders are prepared after payment confirms. Transit time depends on the destination and carrier. You will receive Stripe&apos;s receipt; shipping updates follow once the parcel is handed off.</p>
      <p>If an item is low in stock when you check out, quantity is limited to what is available. We will not ship more than the catalog shows on hand.</p>
    </InfoPage>
  )
}
