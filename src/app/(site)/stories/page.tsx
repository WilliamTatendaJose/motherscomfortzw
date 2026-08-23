import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { StoryCard } from '@/components/content/StoryCard'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getStories, getStoriesPageContent } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getStoriesPageContent()
  return {
    title: content.seo?.title || content.heading,
    description: content.seo?.description || content.intro,
  }
}

export default async function StoriesPage() {
  const [content, stories] = await Promise.all([getStoriesPageContent(), getStories()])

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.heading}
        intro={content.intro}
        image={content.heroImage}
      />

      <Section tone="cream">
        {stories.length === 0 ? (
          <p className="text-center text-lg text-ink-muted">{content.emptyStateText}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </Section>

      <CTABanner heading={content.ctaHeading} body={content.ctaBody} />
    </>
  )
}
