import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { ProgrammeCard } from '@/components/content/ProgrammeCard'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getProgrammes, getWhatWeDoContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWhatWeDoContent()
  return {
    title: content.seo?.title || content.title,
    description: content.seo?.description || content.intro,
  }
}

export default async function WhatWeDoPage() {
  const [content, programmes] = await Promise.all([getWhatWeDoContent(), getProgrammes()])

  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

      <Section tone="cream">
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
