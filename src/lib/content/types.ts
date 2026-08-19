/**
 * Content shapes shared by the Sanity queries and the static fallbacks in
 * `src/content`. Both sources must satisfy these types, so a page never has to
 * care which one it got.
 */
import type { PortableTextBlock } from '@portabletext/react'

export type ContentImage = {
  url: string
  alt: string
  lqip?: string | null
  aspectRatio?: number | null
}

export type SiteSettings = {
  organisationName: string
  tagline: string
  shortDescription: string
  email: string
  phone: string
  whatsapp: string
  address: string
  socials: { platform: string; url: string }[]
}

export type Programme = {
  _id: string
  title: string
  slug: string
  summary: string
  body?: PortableTextBlock[] | null
  icon: ProgrammeIcon
  image?: ContentImage | null
  order: number
}

export type ProgrammeIcon = 'stethoscope' | 'heart' | 'sparkles' | 'book' | 'basket'

export type Story = {
  _id: string
  title: string
  slug: string
  motherName: string
  publishAnonymously: boolean
  portrait?: ContentImage | null
  excerpt: string
  body?: PortableTextBlock[] | null
  plainBody?: string[]
  publishedAt: string
  featured: boolean
  isFounderStory: boolean
  role?: string | null
}

export type DonationTier = {
  _id: string
  amount: number
  currency: 'USD'
  label: string
  description: string
  icon: DonationIcon
  kind: 'essentials' | 'training'
  order: number
}

export type DonationIcon =
  | 'cotton'
  | 'bath'
  | 'blanket'
  | 'clothing'
  | 'clinic'
  | 'package'
  | 'baking'

export type InKindItem = {
  _id: string
  name: string
  accepted: boolean
  icon: InKindIcon
  order: number
}

export type InKindIcon =
  | 'diapers'
  | 'wipes'
  | 'clothing'
  | 'blanket'
  | 'pads'
  | 'cotton'
  | 'spirit'
  | 'jelly'
  | 'bathtub'
  | 'bucket'

export type ImpactStat = {
  _id: string
  value: string
  label: string
  source?: string | null
  order: number
}

/** One of Mother's Comfort's own achievements to date — see the Impact page. */
export type ImpactMetric = {
  _id: string
  value: string
  label: string
  description?: string | null
  order: number
}

export type SiteEvent = {
  _id: string
  title: string
  slug: string
  summary: string
  startsAt: string
  location: string
  image?: ContentImage | null
}

export type TeamMember = {
  _id: string
  name: string
  role: string
  bio?: string | null
  photo?: ContentImage | null
  order: number
}

export type Faq = {
  _id: string
  question: string
  answer: string
  order: number
}

export type HomeContent = {
  heroHeading: string
  heroSubheading: string
  heroImage: ContentImage | null
  introHeading: string
  introBody: string[]
  ctaHeading: string
  ctaBody: string
}

export type AboutContent = {
  purpose: string
  missionPoints: string[]
  values: string[]
  storyHeading: string
  /** Optional. Falls back to the founder's portrait when unset. */
  storyImage?: ContentImage | null
}

export type WhatWeDoContent = {
  eyebrow: string
  heading: string
  intro: string
  heroImage: ContentImage | null
  ctaHeading: string
  ctaBody: string
}

export type ImpactContent = {
  eyebrow: string
  heading: string
  intro: string
  heroImage: ContentImage | null
  supportImage: ContentImage | null
  conclusionHeading: string
  conclusionBody: string
  ctaHeading: string
  ctaBody: string
}

/** One card in the "There is more than one way to help" grid. */
export type InvolvementWay = {
  _id: string
  title: string
  body: string
  order: number
}

export type GetInvolvedContent = {
  eyebrow: string
  heading: string
  intro: string
  heroImage: ContentImage | null
  actionImage: ContentImage | null
  formHeading: string
  formBody: string
}

export type DonateContent = {
  heading: string
  intro: string[]
  essentialsHeading: string
  essentialsIntro: string
  trainingHeading: string
  trainingIntro: string
  cashHeading: string
  cashBody: string
  inKindHeading: string
  inKindBody: string
  inKindWarning: string
  bankDetails: { label: string; value: string }[]
}
