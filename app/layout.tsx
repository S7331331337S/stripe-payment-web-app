import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/app-shell'
import { AppUIProvider } from '@/components/app-ui'
import { CartProvider } from '@/components/cart-provider'
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from '@/lib/site'

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  // Required so relative OG/canonical URLs resolve to absolute ones.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Clinical Research Supply`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Clinical Research Supply`,
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Clinical Research Supply`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lets the shell paint under the notch and home indicator.
  viewportFit: 'cover',
  // The shell is light-only (`<html className="light">`), so declaring both
  // would tell the browser to render form controls for a dark theme that the
  // page never applies.
  colorScheme: 'light',
  themeColor: '#fafafa',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${sans.variable} ${serif.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <AppUIProvider>
            <AppShell>{children}</AppShell>
          </AppUIProvider>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
