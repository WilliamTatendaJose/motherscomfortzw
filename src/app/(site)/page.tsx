import Image from 'next/image'

import { CTABanner } from '@/components/content/CTABanner'
import { ImpactStats } from '@/components/content/ImpactStats'
import { ProgrammeCard } from '@/components/content/ProgrammeCard'
import { StoryCard } from '@/components/content/StoryCard'
import { DonationGlyph } from '@/components/icons'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import {
  getDonationTiers,
  getFeaturedStories,
  getHomeContent,
  getImpactStats,
  getProgrammes,
} from '@/lib/content'
import { imageUrl } from '@/lib/sanity/image'

export default async function HomePage() {
  const [home, programmes, stories, stats, tiers] = await Promise.all([
    getHomeContent(),
    getProgrammes(),
    getFeaturedStories(3),
    getImpactStats(),
    getDonationTiers(),
  ])

  const hero = imageUrl(home.heroImage, { width: 1400 })
  const ladder = tiers.filter((tier) => tier.kind === 'essentials').slice(0, 4)

  return (
    <>
      <section className="relative overflow-hidden bg-brand-pink-tint">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
              Nurturing moms to be
            </p>
            <h1 className="text-4xl leading-tight md:text-5xl lg:text-6xl">{home.heroHeading}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              {home.heroSubheading}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/donate" size="lg">
                Donate now
              </ButtonLink>
              <ButtonLink href="/stories" size="lg" variant="outline">
                Read their stories
              </ButtonLink>
            </div>
          </div>

          {hero && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-lift lg:aspect-square">
              <Image
                src={hero}
                alt={home.heroImage?.alt ?? ''}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <Section tone="white">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl md:text-4xl">{home.introHeading}</h2>
            {home.introBody.map((paragraph, i) => (
              <p key={i} className="mt-5 text-lg leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
            <ButtonLink href="/about" variant="outline" className="mt-8">
              About Mother&rsquo;s Comfort
            </ButtonLink>
          </div>

          <div className="rounded-card bg-brand-pink-tint p-7 md:p-9">
            <h3 className="text-xl">What your donation could do</h3>
            <ul className="mt-6 space-y-4">
              {ladder.map((tier) => (
                <li key={tier._id} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-teal-deep font-display text-sm font-bold text-white">
                    ${tier.amount}
                  </span>
                  <span className="flex items-start gap-3 pt-1.5">
                    <DonationGlyph
                      icon={tier.icon}
                      className="hidden h-5 w-5 shrink-0 text-brand-pink-deep sm:block"
                    />
                    <span className="text-ink-muted">{tier.description}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/donate" className="mt-8 w-full sm:w-auto">
              See all the ways to give
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="tealDeep">
        <SectionHeader
          eyebrow="Did you know?"
          title="Why this work matters"
          inverse
        />
        <ImpactStats stats={stats} />
      </Section>

      <Section tone="cream">
        <SectionHeader
          eyebrow="What we do"
          title="Care, counselling and a way forward"
          intro="We support mothers through pregnancy and beyond — and then help them build an income of their own."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {programmes.map((programme) => (
            <ProgrammeCard key={programme._id} programme={programme} />
          ))}
        </div>
      </Section>

      {stories.length > 0 && (
        <Section tone="white">
          <SectionHeader
            eyebrow="A mother's story"
            title="Hear it from the mothers themselves"
            intro="Every woman has a story. These are theirs, in their own words."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/stories" variant="outline">
              Read more stories
            </ButtonLink>
          </div>
        </Section>
      )}

      <CTABanner heading={home.ctaHeading} body={home.ctaBody} />
    </>
  )
}
