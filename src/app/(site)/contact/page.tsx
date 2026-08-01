import type { Metadata } from 'next'

import { ContactForm } from '@/components/forms/ContactForm'
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/icons'
import { PageHeader } from '@/components/site/PageHeader'
import { Section } from '@/components/ui/Section'
import { getSiteSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    "Get in touch with Mother's Comfort in Harare, Zimbabwe — by phone, email or WhatsApp.",
}

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const whatsappDigits = settings.whatsapp.replace(/[^\d]/g, '')

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        intro="Questions about donating, volunteering or our work? We'd love to hear from you."
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="text-2xl">Talk to us</h2>
            <ul className="mt-6 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep">
                  <PinIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink">Visit us</span>
                  <span className="text-ink-muted">{settings.address}</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink">Call us</span>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, '')}`}
                    className="text-ink-muted hover:underline"
                  >
                    {settings.phone}
                  </a>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep">
                  <MailIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-ink">Email us</span>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-ink-muted hover:underline"
                  >
                    {settings.email}
                  </a>
                </span>
              </li>
              {whatsappDigits && (
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display font-semibold text-ink">WhatsApp</span>
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-muted hover:underline"
                    >
                      {settings.whatsapp}
                    </a>
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-card bg-white p-6 shadow-soft md:p-8">
            <h2 className="text-2xl">Send us a message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
