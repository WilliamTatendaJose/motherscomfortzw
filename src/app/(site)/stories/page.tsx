import type { Metadata } from 'next'

import { CTABanner } from '@/components/content/CTABanner'
import { StoryCard } from '@/components/content/StoryCard'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getStories } from '@/lib/content'

export const metadata: Metadata = {
  title: "A mother's story",
  description:
    "Real stories from the mothers Mother's Comfort supports, and from the founder whose own birth experience started it all.",
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <>
      <PageHeader
        eyebrow="A mother's story"
        title="Every woman has a story"
        intro="These are the mothers behind our work, in their own words — what they faced, and what changed when someone helped."
      />

      <Section tone="cream">
        {stories.length === 0 ? (
          <p className="text-center text-lg text-ink-muted">
            Stories are being prepared. Please check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </Section>

      <CTABanner
        heading="Help write the next story"
        body="$25 registers one expectant mother for antenatal care at a local polyclinic."
      />
    </>
  )
}
