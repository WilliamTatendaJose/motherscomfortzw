import Image from 'next/image'
import Link from 'next/link'

import { MailIcon, PhoneIcon, PinIcon } from '@/components/icons'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import type { SiteSettings } from '@/lib/content/types'

const links = [
  { href: '/about', label: 'About us' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/stories', label: "A mother's story" },
  { href: '/donate', label: 'Donate' },
  { href: '/get-involved', label: 'Get involved' },
  { href: '/contact', label: 'Contact us' },
]

const LEGAL_PAGES = [
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'terms', label: 'Terms' },
]

export function Footer({
  settings,
  pageSlugs = [],
}: {
  settings: SiteSettings
  pageSlugs?: string[]
}) {
  const socials = settings.socials.filter((s) => s.url)
  // Only link to legal pages that actually exist in the CMS — the previous site
  // shipped several links that went nowhere.
  const legal = LEGAL_PAGES.filter((page) => pageSlugs.includes(page.slug))

  return (
    <footer className="bg-brand-teal-deep text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full bg-white object-contain p-1"
            />
            <span className="font-display text-lg leading-tight font-bold">
              {settings.organisationName}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/85">{settings.tagline}</p>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/85">
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:underline">
                {settings.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/85 hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-base font-bold text-white">Stay in touch</h2>
          <p className="mt-4 text-sm text-white/85">
            Occasional updates on our work. No spam, and you can unsubscribe any time.
          </p>
          <NewsletterForm className="mt-4" />
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.url}
                    className="text-sm text-white/85 capitalize hover:text-white hover:underline"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {settings.organisationName}. All rights reserved.
          </p>
          {legal.length > 0 && (
            <div className="flex gap-4">
              {legal.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="hover:text-white hover:underline"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
