import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { GalleryGrid } from '@/components/content/GalleryGrid'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getGalleryContent, getGalleryPhotos } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getGalleryContent()
  return {
    title: content.seo?.title || content.heading,
    description: content.seo?.description || content.intro,
  }
}

export default async function GalleryPage() {
  const [content, photos] = await Promise.all([getGalleryContent(), getGalleryPhotos()])

  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.heading} intro={content.intro} />

      <Section tone="cream">
        {photos.length === 0 ? (
          <p className="text-center text-lg text-ink-muted">{content.emptyStateText}</p>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </Section>

      <CTABanner heading={content.ctaHeading} body={content.ctaBody} />
    </>
  )
}
