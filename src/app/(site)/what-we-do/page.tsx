import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { ProgrammeCard } from '@/components/content/ProgrammeCard'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getProgrammes } from '@/lib/content'

export const metadata: Metadata = {
  title: 'What we do',
  description:
    "Antenatal care, counselling and economic empowerment — how Mother's Comfort supports expectant mothers in Zimbabwe.",
}

export default async function WhatWeDoPage() {
  const programmes = await getProgrammes()

  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Care through pregnancy, and a way forward after it"
        intro="We support mothers with the care they need to deliver safely, and then help them build an income of their own."
      />

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme._id} programme={programme} />
          ))}
        </div>
      </Section>

      <CTABanner
        heading="Support this work"
        body="$120 covers a complete maternity support package for one mother."
      />
    </>
  )
}
