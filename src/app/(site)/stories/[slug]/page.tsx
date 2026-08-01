import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CTABanner } from '@/components/content/CTABanner'
import { StoryBody } from '@/components/content/StoryBody'
import { StoryCard } from '@/components/content/StoryCard'
import { Section } from '@/components/ui/Section'
import { getRelatedStories, getStories, getStory } from '@/lib/content'
import { displayName, formatStoryDate, showPortrait } from '@/lib/content/story'
import { imageUrl } from '@/lib/sanity/image'

export async function generateStaticParams() {
  const stories = await getStories()
  return stories.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) return { title: 'Story not found' }

  const portrait = showPortrait(story) ? imageUrl(story.portrait, { width: 1200 }) : null

  return {
    title: story.title,
    description: story.excerpt,
    openGraph: {
      type: 'article',
      title: story.title,
      description: story.excerpt,
      publishedTime: story.publishedAt,
      images: portrait ? [portrait] : undefined,
    },
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = await getStory(slug)

  if (!story) notFound()

  const related = await getRelatedStories(slug, 3)
  const portrait = showPortrait(story) ? imageUrl(story.portrait, { width: 1000 }) : null

  return (
    <>
      <article>
        <div className="border-b border-brand-pink-soft bg-brand-pink-tint">
          <div className="container-page py-14 md:py-20">
            <div className="mx-auto max-w-3xl">
              <Link
                href="/stories"
                className="font-display text-sm font-semibold text-brand-pink-deep hover:underline"
              >
                ← All stories
              </Link>
              <h1 className="mt-4 text-4xl leading-tight md:text-5xl">{story.title}</h1>
              <p className="mt-5 font-display font-semibold text-brand-teal-deep">
                {displayName(story)}
                {story.role && <span className="text-ink-muted"> · {story.role}</span>}
              </p>
              {story.publishedAt && (
                <p className="mt-1 text-sm text-ink-subtle">
                  <time dateTime={story.publishedAt}>{formatStoryDate(story.publishedAt)}</time>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="container-page py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            {portrait && (
              <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-card">
                <Image
                  src={portrait}
                  alt={story.portrait?.alt || ''}
                  fill
                  priority
                  sizes="(min-width: 768px) 48rem, 90vw"
                  className="object-cover"
                />
              </div>
            )}

            <p className="mb-8 border-l-4 border-brand-pink pl-5 text-xl leading-relaxed text-ink italic">
              {story.excerpt}
            </p>

            <StoryBody story={story} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="white">
          <h2 className="mb-8 text-2xl">More stories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <StoryCard key={item._id} story={item} />
            ))}
          </div>
        </Section>
      )}

      <CTABanner
        heading="Your kindness brings hope"
        body="Every dollar makes a difference to a mother preparing to welcome her baby."
      />
    </>
  )
}
