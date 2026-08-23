import type {
  AboutContent,
  ContactContent,
  DonateContent,
  GetInvolvedContent,
  HomeContent,
  SiteSettings,
  StoriesContent,
  WhatWeDoContent,
} from '@/lib/content/types'

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
  // Same list the header menu, mobile drawer and footer "Explore" column all
  // read from. "Home" and "Donate now" are added around this in the
  // components that need them — see Header.tsx and Footer.tsx.
  navigation: [
    { label: 'About', href: '/about' },
    { label: 'What we do', href: '/what-we-do' },
    { label: "A mother's story", href: '/stories' },
    { label: 'Get involved', href: '/get-involved' },
    { label: 'Contact', href: '/contact' },
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
  seo: {
    title: 'About us',
    description:
      "Mother's Comfort improves the quality of life of vulnerable pregnant women and their children in Zimbabwe — our purpose, mission and values.",
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

export const whatWeDoContent: WhatWeDoContent = {
  eyebrow: 'Our work',
  title: 'Care through pregnancy, and a way forward after it',
  intro:
    'We support mothers with the care they need to deliver safely, and then help them build an income of their own.',
  ctaHeading: 'Support this work',
  ctaBody: '$120 covers a complete maternity support package for one mother.',
  seo: {
    title: 'What we do',
    description:
      "Antenatal care, counselling and economic empowerment — how Mother's Comfort supports expectant mothers in Zimbabwe.",
  },
}

export const storiesContent: StoriesContent = {
  eyebrow: "A mother's story",
  title: 'Every woman has a story',
  intro:
    'These are the mothers behind our work, in their own words — what they faced, and what changed when someone helped.',
  emptyStateText: 'Stories are being prepared. Please check back soon.',
  ctaHeading: 'Help write the next story',
  ctaBody: '$25 registers one expectant mother for antenatal care at a local polyclinic.',
  seo: {
    title: "A mother's story",
    description:
      "Real stories from the mothers Mother's Comfort supports, and from the founder whose own birth experience started it all.",
  },
}

export const getInvolvedContent: GetInvolvedContent = {
  eyebrow: 'Get involved',
  title: 'There is more than one way to help',
  intro:
    'Whether you have time, skills, goods or a network to mobilise — there is a place for you here.',
  ways: [
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
  ],
  formHeading: 'Tell us how you’d like to help',
  formBody:
    'Fill in the form and we’ll get back to you. If you’d rather talk it through, message us on WhatsApp — the button is at the bottom of your screen.',
  eventsEyebrow: 'Events',
  eventsHeading: 'Come and join us',
  seo: {
    title: 'Get involved',
    description:
      "Volunteer, partner with us, run a donation drive or sponsor skills training — the ways to support Mother's Comfort.",
  },
}

export const contactContent: ContactContent = {
  eyebrow: 'Contact',
  title: 'Get in touch',
  intro: "Questions about donating, volunteering or our work? We'd love to hear from you.",
  talkHeading: 'Talk to us',
  formHeading: 'Send us a message',
  seo: {
    title: 'Contact us',
    description:
      "Get in touch with Mother's Comfort in Harare, Zimbabwe — by phone, email or WhatsApp.",
  },
}
