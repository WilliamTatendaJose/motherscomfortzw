import type { Metadata } from 'next'

import { DonationStatus } from '@/components/donate/DonationStatus'
import { Section } from '@/components/ui/Section'

export const metadata: Metadata = {
  title: 'Your donation',
  robots: { index: false, follow: false },
}

export default async function DonateReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>
}) {
  const { reference } = await searchParams

  return (
    <Section tone="cream">
      <DonationStatus reference={reference ?? ''} />
    </Section>
  )
}
