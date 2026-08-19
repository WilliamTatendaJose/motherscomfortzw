import type { Metadata } from 'next'
import Image from 'next/image'

import { VolunteerForm } from '@/components/forms/VolunteerForm'
import { CalendarIcon, PinIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getInvolvedPageContent, getInvolvementWays, getUpcomingEvents } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Get involved',
  description:
    "Volunteer, partner with us, run a donation drive or sponsor skills training — the ways to support Mother's Comfort.",
}

export default async function GetInvolvedPage() {
  const [content, ways, events] = await Promise.all([
    getInvolvedPageContent(),
    getInvolvementWays(),
    getUpcomingEvents(),
  ])

  return (
    <>
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.heading}
        intro={content.intro}
        image={{
          url: '/images/volunteer.jpg',
          alt: "Mother's Comfort team supporting a mother at a clinic",
        }}
      />

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift">
            <Image
              src="/images/training.JPG"
              alt="Women learning practical skills at sewing machines"
              fill
              sizes="(min-width: 1024px) 31vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-brand-teal-deep/95 p-5 text-white shadow-soft">
              <p className="font-display text-xl font-bold">Bring what you can</p>
              <p className="mt-1 text-sm leading-relaxed text-white/85">Time, skills, goods or connections can all become meaningful support.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {ways.map((way, index) => (
              <article key={way._id} className="group rounded-card bg-white p-6 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink-soft font-display font-bold text-brand-pink-deep">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-5 text-xl">{way.title}</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{way.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-4">
            <h2 className="text-3xl">{content.formHeading}</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{content.formBody}</p>
            <ButtonLink href="/donate" variant="outline" className="mt-6">
              Or make a donation
            </ButtonLink>
          </div>
          <VolunteerForm />
        </div>
      </Section>

      {events.length > 0 && (
        <Section tone="cream">
          <SectionHeader eyebrow="Events" title="Come and join us" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article key={event._id} className="rounded-card bg-white p-7 shadow-soft">
                <h3 className="text-xl">{event.title}</h3>
                <p className="mt-3 text-ink-muted">{event.summary}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink-muted">
                  <li className="flex gap-2">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-brand-pink-deep" />
                    <time dateTime={event.startsAt}>
                      {new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      }).format(new Date(event.startsAt))}
                    </time>
                  </li>
                  {event.location && (
                    <li className="flex gap-2">
                      <PinIcon className="h-4 w-4 shrink-0 text-brand-pink-deep" />
                      {event.location}
                    </li>
                  )}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
