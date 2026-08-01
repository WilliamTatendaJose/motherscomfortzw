import 'server-only'

import { donationTiers, inKindItems } from '@/content/donations'
import { impactStats, programmeBodies, programmes } from '@/content/programmes'
import { stories } from '@/content/stories'
import { aboutContent, donateContent, homeContent, siteSettings } from '@/content/site'
import { imageProjection } from '@/lib/sanity/image'
import { sanityFetch } from '@/lib/sanity/client'
import type {
  AboutContent,
  DonateContent,
  DonationTier,
  Faq,
  HomeContent,
  ImpactStat,
  InKindItem,
  Programme,
  SiteEvent,
  SiteSettings,
  Story,
  TeamMember,
} from './types'

/**
 * Every getter here follows the same shape: ask Sanity, and if Sanity is not
 * configured, errored, or simply has no documents yet, return the migrated
 * static content instead. That keeps the site fully functional between now and
 * the moment the client finishes populating the Studio.
 */

const nonEmpty = <T>(rows: T[] | null): rows is T[] => Array.isArray(rows) && rows.length > 0

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings>(
    `*[_type == "siteSettings"][0]{
      organisationName, tagline, shortDescription, email, phone, whatsapp, address,
      socials[]{platform, url}
    }`,
    {},
    ['siteSettings'],
  )
  return data ?? siteSettings
}

export async function getHomeContent(): Promise<HomeContent> {
  const data = await sanityFetch<HomeContent>(
    `*[_type == "homePage"][0]{
      heroHeading, heroSubheading, heroImage${imageProjection},
      introHeading, introBody, ctaHeading, ctaBody
    }`,
    {},
    ['homePage'],
  )
  return data ?? homeContent
}

export async function getAboutContent(): Promise<AboutContent> {
  const data = await sanityFetch<AboutContent>(
    `*[_type == "aboutPage"][0]{
      purpose, missionPoints, values, storyHeading, storyImage${imageProjection}
    }`,
    {},
    ['aboutPage'],
  )
  return data ?? aboutContent
}

export async function getDonateContent(): Promise<DonateContent> {
  const data = await sanityFetch<DonateContent>(
    `*[_type == "donatePage"][0]{
      heading, intro, essentialsHeading, essentialsIntro, trainingHeading, trainingIntro,
      cashHeading, cashBody, inKindHeading, inKindBody, inKindWarning,
      bankDetails[]{label, value}
    }`,
    {},
    ['donatePage'],
  )
  return data ?? donateContent
}

export async function getProgrammes(): Promise<Programme[]> {
  const data = await sanityFetch<Programme[]>(
    `*[_type == "programme"] | order(order asc){
      _id, title, "slug": slug.current, summary, body, icon, image${imageProjection}, order
    }`,
    {},
    ['programme'],
  )
  return nonEmpty(data) ? data : programmes
}

export async function getProgramme(slug: string): Promise<Programme | null> {
  const data = await sanityFetch<Programme>(
    `*[_type == "programme" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, summary, body, icon, image${imageProjection}, order
    }`,
    { slug },
    ['programme'],
  )
  return data ?? programmes.find((p) => p.slug === slug) ?? null
}

/** Long-form paragraphs for a programme when it has no Portable Text body yet. */
export function getProgrammeBody(slug: string): string[] {
  return programmeBodies[slug] ?? []
}

const STORY_FIELDS = `
  _id, title, "slug": slug.current, motherName, publishAnonymously,
  portrait${imageProjection}, excerpt, body, role,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "featured": coalesce(featured, false),
  "isFounderStory": coalesce(isFounderStory, false)
`

export async function getStories(): Promise<Story[]> {
  const data = await sanityFetch<Story[]>(
    `*[_type == "story" && defined(slug.current)] | order(isFounderStory desc, publishedAt desc){${STORY_FIELDS}}`,
    {},
    ['story'],
  )
  return nonEmpty(data) ? data : stories
}

export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const all = await getStories()
  const featured = all.filter((s) => s.featured)
  return (featured.length > 0 ? featured : all).slice(0, limit)
}

export async function getStory(slug: string): Promise<Story | null> {
  const data = await sanityFetch<Story>(
    `*[_type == "story" && slug.current == $slug][0]{${STORY_FIELDS}}`,
    { slug },
    ['story'],
  )
  return data ?? stories.find((s) => s.slug === slug) ?? null
}

export async function getRelatedStories(slug: string, limit = 3): Promise<Story[]> {
  const all = await getStories()
  return all.filter((s) => s.slug !== slug).slice(0, limit)
}

export async function getDonationTiers(): Promise<DonationTier[]> {
  const data = await sanityFetch<DonationTier[]>(
    `*[_type == "donationTier"] | order(order asc){
      _id, amount, currency, label, description, icon, kind, order
    }`,
    {},
    ['donationTier'],
  )
  return nonEmpty(data) ? data : donationTiers
}

export async function getInKindItems(): Promise<InKindItem[]> {
  const data = await sanityFetch<InKindItem[]>(
    `*[_type == "inKindItem"] | order(order asc){ _id, name, accepted, icon, order }`,
    {},
    ['inKindItem'],
  )
  return nonEmpty(data) ? data : inKindItems
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  const data = await sanityFetch<ImpactStat[]>(
    `*[_type == "impactStat"] | order(order asc){ _id, value, label, source, order }`,
    {},
    ['impactStat'],
  )
  return nonEmpty(data) ? data : impactStats
}

/**
 * Upcoming events only. The old site still displayed events from 2023; this
 * filters to the future so a stale entry can never look current again.
 */
export async function getUpcomingEvents(): Promise<SiteEvent[]> {
  const data = await sanityFetch<SiteEvent[]>(
    `*[_type == "event" && startsAt >= now()] | order(startsAt asc){
      _id, title, "slug": slug.current, summary, startsAt, location, image${imageProjection}
    }`,
    {},
    ['event'],
  )
  return data ?? []
}

export async function getTeam(): Promise<TeamMember[]> {
  const data = await sanityFetch<TeamMember[]>(
    `*[_type == "teamMember"] | order(order asc){ _id, name, role, bio, photo${imageProjection}, order }`,
    {},
    ['teamMember'],
  )
  // No fallback: the previous team page was fabricated template content
  // ("Donald John", "Adam Phillips"). The section stays hidden until real
  // people are entered in the Studio.
  return data ?? []
}

export async function getFaqs(): Promise<Faq[]> {
  const data = await sanityFetch<Faq[]>(
    `*[_type == "faq"] | order(order asc){ _id, question, answer, order }`,
    {},
    ['faq'],
  )
  return data ?? []
}
