import type { AboutContent, DonateContent, HomeContent, SiteSettings } from '@/lib/content/types'

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
}
