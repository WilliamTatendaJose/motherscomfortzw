import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { ImpactMetrics } from '@/components/content/ImpactMetrics'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getImpactContent, getImpactMetrics } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Our impact',
  description:
    "What Mother's Comfort has achieved so far — mothers, newborns and communities supported in Zimbabwe.",
}

export default async function ImpactPage() {
  const [content, metrics] = await Promise.all([getImpactContent(), getImpactMetrics()])

  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.heading} intro={content.intro} />

      <Section tone="cream">
        <ImpactMetrics metrics={metrics} />
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl">{content.conclusionHeading}</h2>
          <p className="mt-4 leading-relaxed text-ink-muted">{content.conclusionBody}</p>
        </div>
      </Section>

      <CTABanner heading={content.ctaHeading} body={content.ctaBody} />
    </>
  )
}
