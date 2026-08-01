import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CTABanner } from '@/components/content/CTABanner'
import { CheckIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getAboutContent, getStories, getTeam } from '@/lib/content'
import { imageUrl } from '@/lib/sanity/image'

export const metadata: Metadata = {
  title: 'About us',
  description:
    "Mother's Comfort improves the quality of life of vulnerable pregnant women and their children in Zimbabwe — our purpose, mission and values.",
}

export default async function AboutPage() {
  const [about, stories, team] = await Promise.all([getAboutContent(), getStories(), getTeam()])

  const founderStory = stories.find((story) => story.isFounderStory)

  // The About page can carry its own "Our beginning" image. Falling back to the
  // founder's portrait keeps the section illustrated for editors who only ever
  // fill in the story — and respects anonymity, since `portrait` is already
  // stripped upstream when a story is published anonymously.
  const beginningImage = about.storyImage ?? founderStory?.portrait ?? null

  return (
    <>
      <PageHeader eyebrow="About us" title="Learn about us" intro={about.purpose} />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Our mission</h2>
            <ul className="mt-6 space-y-4">
              {about.missionPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand-pink-deep" />
                  <span className="leading-relaxed text-ink-muted">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl">Our values</h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {about.values.map((value) => (
                <li
                  key={value}
                  className="rounded-full bg-white px-5 py-2.5 font-display font-semibold text-brand-teal-deep shadow-soft"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {founderStory && (
        <Section tone="white">
          <div
            className={`grid items-center gap-12 ${beginningImage ? 'lg:grid-cols-2' : ''}`}
          >
            {beginningImage && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-lift">
                <Image
                  src={imageUrl(beginningImage, { width: 900 }) ?? ''}
                  alt={beginningImage.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
                Our beginning
              </p>
              <h2 className="text-3xl">{about.storyHeading}</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">{founderStory.excerpt}</p>
              <p className="mt-4 font-display font-semibold text-brand-teal-deep">
                {founderStory.motherName}
                {founderStory.role && (
                  <span className="text-ink-muted"> · {founderStory.role}</span>
                )}
              </p>
              <ButtonLink href={`/stories/${founderStory.slug}`} variant="outline" className="mt-6">
                Read the full story
              </ButtonLink>
            </div>
          </div>
        </Section>
      )}

      {team.length > 0 && (
        <Section tone="cream">
          <SectionHeader eyebrow="Our team" title="The people behind Mother's Comfort" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => {
              const photo = imageUrl(member.photo, { width: 500 })
              return (
                <article
                  key={member._id}
                  className="overflow-hidden rounded-card bg-white shadow-soft"
                >
                  {photo && (
                    <div className="relative aspect-square">
                      <Image
                        src={photo}
                        alt={member.photo?.alt || ''}
                        fill
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg">{member.name}</h3>
                    <p className="text-sm font-semibold text-brand-teal-deep">{member.role}</p>
                    {member.bio && <p className="mt-2 text-sm text-ink-muted">{member.bio}</p>}
                  </div>
                </article>
              )
            })}
          </div>
        </Section>
      )}

      <Section tone="white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl">What we do</h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            Our work runs across antenatal care, counselling and economic empowerment.
          </p>
          <ButtonLink href="/what-we-do" className="mt-6">
            Explore our programmes
          </ButtonLink>
          <p className="mt-6 text-sm text-ink-muted">
            Or{' '}
            <Link href="/stories" className="text-brand-pink-deep hover:underline">
              read the mothers&rsquo; stories
            </Link>
            .
          </p>
        </div>
      </Section>

      <CTABanner
        heading="Let's help each other"
        body="Your kindness brings hope, comfort and a brighter future to mothers and babies in need."
      />
    </>
  )
}
