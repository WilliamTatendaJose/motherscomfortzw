import type { Metadata } from 'next'

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
      <PageHeader eyebrow={content.eyebrow} title={content.heading} intro={content.intro} />

      <Section tone="cream">
        <div className="grid gap-6 sm:grid-cols-2">
          {ways.map((way) => (
            <article key={way._id} className="rounded-card bg-white p-7 shadow-soft">
              <h2 className="text-xl">{way.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{way.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
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
