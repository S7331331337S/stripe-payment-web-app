import type { Metadata } from 'next'
import { InfoPage } from '@/components/info-page'

export const metadata: Metadata = {
  title: "Terms | Mstrmnd",
  description: "Terms for browsing and ordering from the Mstrmnd research catalog.",
}

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Policy" title="Terms of use">
      <p>Mstrmnd is a research-supply catalog. Every compound is sold for laboratory research use only. Nothing on this site is medical advice, a diagnosis, or a recommendation for human or animal use.</p>
      <p>By placing an order you confirm that you are legally permitted to purchase these materials, that you will handle them according to applicable rules, and that you have reviewed the relevant detail sheet.</p>
      <p>Prices, stock, and catalog notes can change. Checkout is processed by Stripe. An order is confirmed only after Stripe accepts payment. We may cancel or adjust an order if quantity exceeds available stock.</p>
      <p>These terms are the full agreement for using this site. If a court finds one part unenforceable, the rest still applies.</p>
    </InfoPage>
  )
}
