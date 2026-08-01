import type { Metadata } from 'next'

import { VolunteerForm } from '@/components/forms/VolunteerForm'
import { CalendarIcon, PinIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getUpcomingEvents } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Get involved',
  description:
    "Volunteer, partner with us, run a donation drive or sponsor skills training — the ways to support Mother's Comfort.",
}

const ways = [
  {
    title: 'Volunteer your time',
    body: 'Help at collection drives, pack maternity packages, or lend a professional skill.',
  },
  {
    title: 'Partner with us',
    body: 'Companies and churches can sponsor antenatal registrations or a skills training cohort.',
  },
  {
    title: 'Run a donation drive',
    body: 'Collect new baby essentials at your workplace, school or congregation.',
  },
  {
    title: 'Teach a skill',
    body: 'Train mothers in baking, tailoring, poultry, agriculture or detergent making.',
  },
]

export default async function GetInvolvedPage() {
  const events = await getUpcomingEvents()

  return (
    <>
      <PageHeader
        eyebrow="Get involved"
        title="There is more than one way to help"
        intro="Whether you have time, skills, goods or a network to mobilise — there is a place for you here."
      />

      <Section tone="cream">
        <div className="grid gap-6 sm:grid-cols-2">
          {ways.map((way) => (
            <article key={way.title} className="rounded-card bg-white p-7 shadow-soft">
              <h2 className="text-xl">{way.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{way.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl">Tell us how you&rsquo;d like to help</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Fill in the form and we&rsquo;ll get back to you. If you&rsquo;d rather talk it
              through, message us on WhatsApp — the button is at the bottom of your screen.
            </p>
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
