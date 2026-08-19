import type { Metadata } from 'next'
import Image from 'next/image'

import { CTABanner } from '@/components/content/CTABanner'
import { ImpactStats } from '@/components/content/ImpactStats'
import { ImpactMetrics } from '@/components/content/ImpactMetrics'
import { PageHeader } from '@/components/site/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getImpactContent, getImpactMetrics, getImpactStats } from '@/lib/content'
import { imageUrl } from '@/lib/sanity/image'

export const metadata: Metadata = {
  title: 'Our impact',
  description:
    "What Mother's Comfort has achieved so far — mothers, newborns and communities supported in Zimbabwe.",
}

export default async function ImpactPage() {
  const [content, metrics, stats] = await Promise.all([
    getImpactContent(),
    getImpactMetrics(),
    getImpactStats(),
  ])
  const supportImage = imageUrl(content.supportImage, { width: 900 })

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.heading}
        intro={content.intro}
        image={content.heroImage}
      />

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16">
          {content.supportImage && supportImage && (
            <figure className="relative overflow-hidden rounded-[2rem] bg-brand-teal-soft shadow-lift">
              <div className="relative aspect-[4/5]">
                <Image
                  src={supportImage}
                  alt={content.supportImage.alt}
                  fill
                  sizes="(min-width: 1024px) 31vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 shadow-soft">
                <p className="font-display font-bold text-brand-teal-deep">
                  Practical support, with dignity
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                  A safer pregnancy starts with access, preparation and someone who cares.
                </p>
              </figcaption>
            </figure>
          )}
          <div>
            <div className="mb-8 max-w-xl">
              <p className="font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
                The difference your support makes
              </p>
              <p className="mt-3 text-lg leading-relaxed text-ink-muted">
                Every number represents a mother who had one less barrier between her and a
                healthier start for her baby.
              </p>
            </div>
            <ImpactMetrics metrics={metrics} />
          </div>
        </div>
      </Section>

      {stats.length > 0 && (
        <Section tone="tealDeep">
          <SectionHeader
            eyebrow="Why this work matters"
            title="The wider need"
            intro="These context statistics help show why access to care, preparation and practical support matters for mothers and babies."
            inverse
          />
          <ImpactStats stats={stats} />
        </Section>
      )}

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
