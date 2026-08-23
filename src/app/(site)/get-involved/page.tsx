import type { Metadata } from 'next'

import { VolunteerForm } from '@/components/forms/VolunteerForm'
import { CalendarIcon, PinIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getGetInvolvedContent, getUpcomingEvents } from '@/lib/content'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getGetInvolvedContent()
  return {
    title: content.seo?.title || content.title,
    description: content.seo?.description || content.intro,
  }
}

export default async function GetInvolvedPage() {
  const [content, events] = await Promise.all([getGetInvolvedContent(), getUpcomingEvents()])

  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.title} intro={content.intro} />

      {content.ways.length > 0 && (
        <Section tone="cream">
          <div className="grid gap-6 sm:grid-cols-2">
            {content.ways.map((way) => (
              <article key={way.title} className="rounded-card bg-white p-7 shadow-soft">
                <h2 className="text-xl">{way.title}</h2>
                <p className="mt-3 leading-relaxed text-ink-muted">{way.body}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

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
          <SectionHeader eyebrow={content.eventsEyebrow} title={content.eventsHeading} />
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
