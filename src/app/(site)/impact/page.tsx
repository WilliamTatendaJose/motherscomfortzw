import type { Metadata } from 'next'
import Image from 'next/image'

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
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.heading}
        intro={content.intro}
        image={{
          url: '/images/volunteer.jpg',
          alt: "Mother's Comfort team with a mother at a clinic",
        }}
      />

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16">
          <figure className="relative overflow-hidden rounded-[2rem] bg-brand-teal-soft shadow-lift">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/preparation.jpg"
                alt="Baby essentials prepared for a new arrival"
                fill
                sizes="(min-width: 1024px) 31vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-soft">
              <p className="font-display font-bold text-brand-teal-deep">Practical support, with dignity</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">A safer pregnancy starts with access, preparation and someone who cares.</p>
            </figcaption>
          </figure>
          <div>
            <div className="mb-8 max-w-xl">
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
                The difference your support makes
              </p>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">
                Every number represents a mother who had one less barrier between her and a healthier start for her baby.
              </p>
            </div>
            <ImpactMetrics metrics={metrics} />
          </div>
        </div>
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
