import type { Metadata } from 'next'
import { Inter, Quicksand } from 'next/font/google'

import { siteUrl } from '@/lib/env'
import { getSiteSettings } from '@/lib/content'

import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * The organisation name in every browser tab (the `%s | <name>` template) and
 * the default title/description come from Sanity here, not the static
 * fallback import used elsewhere — this is the one place that name is set
 * for the whole site, so renaming the charity in the Studio should not need
 * a code change.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.organisationName} — ${settings.tagline}`,
      template: `%s | ${settings.organisationName}`,
    },
    description: settings.shortDescription,
    openGraph: {
      type: 'website',
      siteName: settings.organisationName,
      locale: 'en_ZW',
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/images/header.ico', apple: '/logo.png' },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZW" className={`${quicksand.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
