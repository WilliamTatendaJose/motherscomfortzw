import type {
  AboutContent,
  ContactContent,
  DonateContent,
  GalleryContent,
  GetInvolvedContent,
  HomeContent,
  ImpactContent,
  SiteSettings,
  StoriesContent,
  WhatWeDoContent,
} from '@/lib/content/types'
import { impactMetrics } from './programmes'

/**
 * Static content migrated from the previous static site and the official
 * donation flyer. This is both the seed data for Sanity (see
 * `sanity/seed/import.ts`) and the fallback the site renders from until the
 * Sanity project is connected. Editing here does not change a live site that
 * already has Sanity content — edit in the Studio instead.
 */

export const siteSettings: SiteSettings = {
  organisationName: "Mother's Comfort",
  tagline: 'Nurturing moms to be',
  shortDescription:
    'A Zimbabwean charity improving the quality of life of vulnerable pregnant women and their children through antenatal care, counselling, baby essentials and skills training.',
  email: 'info@motherscomfort.co.zw',
  phone: '+263 242 311036',
  // From the donation flyer: "07 18439626" — a Zimbabwean mobile, so 071 843 9626.
  // TODO(client): confirm before launch, this drives the wa.me link.
  whatsapp: '+263718439626',
  // TODO(client): the old site published three different addresses
  // (Budiriro West / Anderson Ave Mabelreign / Anderson Ave Cotswold Hills).
  // This is the one to confirm and correct in the Studio.
  address: '34 Anderson Avenue, Cotswold Hills, Harare, Zimbabwe',
  socials: [
    { platform: 'facebook', url: '' },
    { platform: 'instagram', url: '' },
  ],
  // Single source for the header menu, mobile drawer and footer "Explore"
  // column — see Header.tsx and Footer.tsx. "Home" and "Donate Now" are added
  // around this list by the components that need them.
  navigation: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Work', href: '/what-we-do' },
    { label: 'Our Impact', href: '/impact' },
    { label: 'Gallery', href: '/gallery' },
    { label: "A Mother's Story", href: '/stories' },
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Contact Us', href: '/contact' },
  ],
}

export const homeContent: HomeContent = {
  heroHeading: 'Every mother deserves a safe pregnancy',
  heroSubheading:
    'We help underprivileged expectant mothers in Zimbabwe access antenatal care, counselling and the essentials their babies need — and we equip them with skills for a brighter future.',
  // Only genuine Mother's Comfort photographs are used. The previous site's
  // stock imagery (schoolchildren, a Zulu cultural village, cupped hands of
  // coins) has been removed rather than re-captioned as this charity's work.
  heroImage: {
    url: '/images/volunteer.jpg',
    alt: "Mother's Comfort supporting expectant mothers at a local clinic",
  },
  introHeading: 'Your kindness brings hope, comfort and a brighter future',
  introBody: [
    "Mother's Comfort was founded on a simple conviction: no woman should lose her life, or her child's, for want of care that already exists.",
    'We pay antenatal registration fees, provide counselling, prepare mothers with baby essentials, and train them in skills that let them provide for their families long after the birth.',
  ],
  ctaHeading: "Let's help each other",
  ctaBody:
    'Every dollar makes a difference. $25 registers one expectant mother for antenatal care at a local polyclinic.',
  // No override by default — the home page falls back to the root layout's
  // own default title (the organisation name and tagline).
}

export const aboutContent: AboutContent = {
  purpose:
    'Improving the quality of life of vulnerable pregnant women and their children.',
  missionPoints: [
    'To improve access to antenatal care for less privileged expectant mothers',
    'To facilitate economic empowerment of mothers so that they can provide for their children',
    'To provide counselling services to less privileged expectant mothers',
    'To provide newborn essentials to less privileged expectant mothers',
  ],
  // Source list read "Intergrity" and lowercase "transparency" — corrected here.
  values: ['Excellence', 'Nurture', 'Commitment', 'Integrity', 'Transparency'],
  storyHeading: 'How Mother’s Comfort began',
  seo: {
    title: 'About us',
    description:
      "Mother's Comfort improves the quality of life of vulnerable pregnant women and their children in Zimbabwe — our purpose, mission and values.",
  },
}

export const whatWeDoContent: WhatWeDoContent = {
  eyebrow: 'Our work',
  heading: 'Care through pregnancy, and a way forward after it',
  intro:
    'We support mothers with the care they need for a safe pregnancy and birth, then help them build an income and a more secure future for themselves and their children',
  heroImage: {
    url: '/images/preparation.jpg',
    alt: 'Baby essentials prepared for a new arrival',
  },
  ctaHeading: 'Support this work',
  ctaBody: '$120 covers a complete maternity support package for one mother.',
  seo: {
    title: 'What we do',
    description:
      "Antenatal care, counselling and economic empowerment — how Mother's Comfort supports expectant mothers in Zimbabwe.",
  },
}

export const impactContent: ImpactContent = {
  eyebrow: 'Our impact',
  heading: 'What we have done so far',
  intro:
    "A look at the mothers and babies we've been able to support — and the reach we still hope to grow.",
  impactResults: impactMetrics,
  heroImage: {
    url: '/images/volunteer.jpg',
    alt: "Mother's Comfort team with a mother at a clinic",
  },
  supportImage: {
    url: '/images/preparation.jpg',
    alt: 'Baby essentials prepared for a new arrival',
  },
  conclusionHeading: 'This is only the beginning.',
  conclusionBody:
    'The need extends far beyond the women we have been able to reach. Many mothers across different communities and health facilities still face financial barriers to accessing antenatal care and preparing for their babies. With greater support, Mother’s Comfort can reach more women, more clinics and more communities.',
  ctaHeading: 'Help us reach more mothers',
  ctaBody: '$25 registers one expectant mother for antenatal care at a local polyclinic.',
  seo: {
    title: 'Our impact',
    description:
      "What Mother's Comfort has achieved so far — mothers, newborns and communities supported in Zimbabwe.",
  },
}

export const getInvolvedContent: GetInvolvedContent = {
  eyebrow: 'Get involved',
  heading: 'There is more than one way to help',
  intro:
    'Whether you have time, skills, goods or a network to mobilise — there is a place for you here.',
  heroImage: {
    url: '/images/volunteer.jpg',
    alt: "Mother's Comfort team supporting a mother at a clinic",
  },
  actionImage: {
    url: '/images/training.JPG',
    alt: 'Women learning practical skills at sewing machines',
  },
  formHeading: "Tell us how you'd like to help",
  formBody:
    "Fill in the form and we'll get back to you. If you'd rather talk it through, message us on WhatsApp — the button is at the bottom of your screen.",
  eventsEyebrow: 'Events',
  eventsHeading: 'Come And Join Us',
  seo: {
    title: 'Get involved',
    description:
      "Volunteer, partner with us, run a donation drive or sponsor skills training — the ways to support Mother's Comfort.",
  },
}

export const donateContent: DonateContent = {
  heading: 'How to donate',
  intro: [
    'Your kindness brings hope, comfort and a brighter future to mothers and babies in need.',
    'We need your help to support as many pregnant women as possible to give their babies the best start in life. Your support helps us pay antenatal registration fees, provide counselling, prepare mothers with baby essentials, and empower them with skills.',
  ],
  essentialsHeading: 'Make a cash donation',
  essentialsIntro: 'Every dollar makes a difference.',
  trainingHeading: 'Sponsor skills training',
  trainingIntro:
    'Empower mothers with skills for a better tomorrow. You can also partner with us by sponsoring a mother in another approved skills training programme.',
  cashHeading: 'Cash and bank donations',
  cashBody:
    'You can drop off cash donations at our offices or in the CBD, and we can arrange to collect from anywhere within Harare. Get in touch on WhatsApp to arrange a time.',
  inKindHeading: 'Donate baby essentials',
  inKindBody:
    'We gladly accept new, unused items. Drop them at one of our collection bins, or arrange for us to collect from anywhere within Harare.',
  inKindWarning: 'We do NOT accept loose diapers or opened packs of wipes.',
  // TODO(client): supply real bank details, or remove this block entirely.
  bankDetails: [],
  seo: {
    title: 'How to donate',
    description:
      "Donate to Mother's Comfort by card, EcoCash, OneMoney or InnBucks — or give baby essentials. $25 registers one expectant mother for antenatal care.",
  },
}

export const storiesContent: StoriesContent = {
  eyebrow: "A mother's story",
  heading: 'Every woman has a story',
  intro:
    'These are the mothers behind our work, in their own words — what they faced, and what changed when someone helped.',
  heroImage: null,
  emptyStateText: 'Stories are being prepared. Please check back soon.',
  ctaHeading: 'Help write the next story',
  ctaBody: '$25 registers one expectant mother for antenatal care at a local polyclinic.',
  seo: {
    title: "A mother's story",
    description:
      "Real stories from the mothers Mother's Comfort supports, and from the founder whose own birth experience started it all.",
  },
}

export const contactContent: ContactContent = {
  eyebrow: 'Contact',
  heading: 'Get in touch',
  intro: "Questions about donating, volunteering or our work? We'd love to hear from you.",
  heroImage: null,
  talkHeading: 'Talk to us',
  formHeading: 'Send us a message',
  seo: {
    title: 'Contact us',
    description:
      "Get in touch with Mother's Comfort in Harare, Zimbabwe — by phone, email or WhatsApp.",
  },
}

export const galleryContent: GalleryContent = {
  eyebrow: 'Gallery',
  heading: 'Our work, in pictures',
  intro:
    'A look at the mothers, babies and volunteers behind Mother’s Comfort — antenatal care, skills training and the everyday moments in between.',
  emptyStateText: 'Photos are being added. Please check back soon.',
  ctaHeading: 'Help us do more of this',
  ctaBody: 'Every dollar makes a difference to a mother preparing to welcome her baby.',
  seo: {
    title: 'Gallery',
    description:
      "Photos of Mother's Comfort's work in Zimbabwe — antenatal care, skills training and the mothers and babies we support.",
  },
}
