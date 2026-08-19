import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { ProgrammeCard } from '@/components/content/ProgrammeCard'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getProgrammes, getWhatWeDoContent } from '@/lib/content'

export const metadata: Metadata = {
  title: 'What we do',
  description:
    "Antenatal care, counselling and economic empowerment — how Mother's Comfort supports expectant mothers in Zimbabwe.",
}

export default async function WhatWeDoPage() {
  const [content, programmes] = await Promise.all([getWhatWeDoContent(), getProgrammes()])

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.heading}
        intro={content.intro}
        image={content.heroImage}
      />

      <Section tone="cream">
        <div className="mb-10 max-w-2xl">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
            Support that meets mothers where they are
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">
            From a first antenatal visit to practical skills for the years ahead, each programme is designed to make motherhood safer and more secure.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme._id} programme={programme} />
          ))}
        </div>
      </Section>

      <CTABanner heading={content.ctaHeading} body={content.ctaBody} />
    </>
  )
}
