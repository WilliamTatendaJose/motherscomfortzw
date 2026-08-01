import type { Metadata } from 'next'
import { Inter, Quicksand } from 'next/font/google'

import { siteSettings } from '@/content/site'
import { siteUrl } from '@/lib/env'

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteSettings.organisationName} — ${siteSettings.tagline}`,
    template: `%s | ${siteSettings.organisationName}`,
  },
  description: siteSettings.shortDescription,
  openGraph: {
    type: 'website',
    siteName: siteSettings.organisationName,
    locale: 'en_ZW',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/images/header.ico', apple: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZW" className={`${quicksand.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
