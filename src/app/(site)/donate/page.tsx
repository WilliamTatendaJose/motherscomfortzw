import type { Metadata } from 'next'

import { DonationForm } from '@/components/donate/DonationForm'
import { InKindGrid } from '@/components/donate/InKindGrid'
import { DonationGlyph, PhoneIcon, PinIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { Section, SectionHeader } from '@/components/ui/Section'
import { getDonateContent, getDonationTiers, getInKindItems, getSiteSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'How to donate',
  description:
    "Donate to Mother's Comfort by card, EcoCash, OneMoney or InnBucks — or give baby essentials. $25 registers one expectant mother for antenatal care.",
}

export default async function DonatePage() {
  const [content, tiers, inKind, settings] = await Promise.all([
    getDonateContent(),
    getDonationTiers(),
    getInKindItems(),
    getSiteSettings(),
  ])

  const essentials = tiers.filter((tier) => tier.kind === 'essentials')
  const training = tiers.filter((tier) => tier.kind === 'training')

  return (
    <>
      <PageHeader eyebrow="Let's help each other" title={content.heading} intro={content.intro[0]} />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-3xl">{content.essentialsHeading}</h2>
            <p className="mt-3 font-display font-semibold text-brand-pink-deep">
              {content.essentialsIntro}
            </p>
            {content.intro.slice(1).map((paragraph, i) => (
              <p key={i} className="mt-4 leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}

            <ul className="mt-8 space-y-4">
              {essentials.map((tier) => (
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
          </div>

          <div id="give">
            <DonationForm tiers={tiers} />
          </div>
        </div>
      </Section>

      {training.length > 0 && (
        <Section tone="white">
          <SectionHeader
            eyebrow="Sponsor skills training"
            title={content.trainingHeading}
            intro={content.trainingIntro}
          />
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            {training.map((tier) => (
              <article key={tier._id} className="rounded-card bg-brand-pink-tint p-7">
                <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-pink-deep">
                  <DonationGlyph icon={tier.icon} className="h-7 w-7" />
                </span>
                <p className="font-display text-2xl font-bold text-brand-teal-deep">
                  ${tier.amount}
                </p>
                <h3 className="mt-1 text-lg">{tier.label}</h3>
                <p className="mt-2 text-ink-muted">{tier.description}</p>
              </article>
            ))}
          </div>
        </Section>
      )}

      <Section tone="cream">
        <SectionHeader
          eyebrow="Donate baby essentials"
          title={content.inKindHeading}
          intro={content.inKindBody}
        />
        <InKindGrid items={inKind} warning={content.inKindWarning} />
      </Section>

      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">{content.cashHeading}</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{content.cashBody}</p>

            <ul className="mt-6 space-y-3 text-ink-muted">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink-deep" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink-deep" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:underline">
                  {settings.phone}
                </a>
              </li>
            </ul>
          </div>

          {content.bankDetails.length > 0 && (
            <div className="rounded-card bg-brand-teal-soft p-7">
              <h2 className="text-2xl">Bank transfer</h2>
              <dl className="mt-5 space-y-3">
                {content.bankDetails.map((detail) => (
                  <div key={detail.label} className="flex flex-wrap gap-x-3">
                    <dt className="font-display text-sm font-semibold text-ink">{detail.label}</dt>
                    <dd className="text-ink-muted">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </Section>
    </>
  )
}
