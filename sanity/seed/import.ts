/**
 * Seeds a Sanity dataset with the content migrated from the previous website
 * and the official donation flyer.
 *
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID and a SANITY_WRITE_TOKEN with Editor
 * permissions. Run it once against a fresh dataset.
 *
 * It uses `createOrReplace` with stable, human-readable ids, so re-running is
 * safe and idempotent — but note it *overwrites*, so once the client has begun
 * editing in the Studio, do not run it again against that dataset.
 */
import { createClient } from '@sanity/client'

import { donationTiers, inKindItems } from '../../src/content/donations'
import { impactStats, programmeBodies, programmes } from '../../src/content/programmes'
import { stories } from '../../src/content/stories'
import { aboutContent, donateContent, homeContent, siteSettings } from '../../src/content/site'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing configuration.\n' +
      '  NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN must both be set.\n' +
      '  Create a token at https://sanity.io/manage → API → Tokens (Editor permissions).',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2024-10-01',
  useCdn: false,
})

/** Minimal Portable Text: one block per paragraph. */
function toPortableText(paragraphs: string[]) {
  return paragraphs.map((text, index) => ({
    _type: 'block',
    _key: `p${index}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `p${index}s0`, text, marks: [] }],
  }))
}

async function run() {
  const documents: Record<string, unknown>[] = []

  documents.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    organisationName: siteSettings.organisationName,
    tagline: siteSettings.tagline,
    shortDescription: siteSettings.shortDescription,
    address: siteSettings.address,
    phone: siteSettings.phone,
    whatsapp: siteSettings.whatsapp,
    email: siteSettings.email,
    // Social URLs were empty on the old site; left out so the links stay hidden.
    socials: [],
  })

  documents.push({
    _id: 'homePage',
    _type: 'homePage',
    heroHeading: homeContent.heroHeading,
    heroSubheading: homeContent.heroSubheading,
    introHeading: homeContent.introHeading,
    introBody: homeContent.introBody,
    ctaHeading: homeContent.ctaHeading,
    ctaBody: homeContent.ctaBody,
  })

  documents.push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    purpose: aboutContent.purpose,
    missionPoints: aboutContent.missionPoints,
    values: aboutContent.values,
    storyHeading: aboutContent.storyHeading,
  })

  documents.push({
    _id: 'donatePage',
    _type: 'donatePage',
    heading: donateContent.heading,
    intro: donateContent.intro,
    essentialsHeading: donateContent.essentialsHeading,
    essentialsIntro: donateContent.essentialsIntro,
    trainingHeading: donateContent.trainingHeading,
    trainingIntro: donateContent.trainingIntro,
    cashHeading: donateContent.cashHeading,
    cashBody: donateContent.cashBody,
    inKindHeading: donateContent.inKindHeading,
    inKindBody: donateContent.inKindBody,
    inKindWarning: donateContent.inKindWarning,
    bankDetails: [],
  })

  for (const programme of programmes) {
    documents.push({
      _id: programme._id,
      _type: 'programme',
      title: programme.title,
      slug: { _type: 'slug', current: programme.slug },
      summary: programme.summary,
      body: toPortableText(programmeBodies[programme.slug] ?? []),
      icon: programme.icon,
      order: programme.order,
    })
  }

  for (const story of stories) {
    documents.push({
      _id: story._id,
      _type: 'story',
      title: story.title,
      slug: { _type: 'slug', current: story.slug },
      motherName: story.motherName,
      role: story.role ?? undefined,
      publishAnonymously: story.publishAnonymously,
      // Seeded as true because these stories were already published on the
      // previous public website. Confirm the paperwork before launch.
      consentConfirmed: true,
      excerpt: story.excerpt,
      body: toPortableText(story.plainBody ?? []),
      publishedAt: new Date(story.publishedAt).toISOString(),
      featured: story.featured,
      isFounderStory: story.isFounderStory,
    })
  }

  for (const tier of donationTiers) {
    documents.push({
      _id: tier._id,
      _type: 'donationTier',
      amount: tier.amount,
      currency: tier.currency,
      label: tier.label,
      description: tier.description,
      icon: tier.icon,
      kind: tier.kind,
      order: tier.order,
    })
  }

  for (const item of inKindItems) {
    documents.push({
      _id: item._id,
      _type: 'inKindItem',
      name: item.name,
      accepted: item.accepted,
      icon: item.icon,
      order: item.order,
    })
  }

  for (const stat of impactStats) {
    documents.push({
      _id: stat._id,
      _type: 'impactStat',
      value: stat.value,
      label: stat.label,
      source: stat.source ?? undefined,
      order: stat.order,
    })
  }

  console.log(`Importing ${documents.length} documents into ${projectId}/${dataset}…`)

  const transaction = client.transaction()
  for (const doc of documents) {
    transaction.createOrReplace(doc as never)
  }
  await transaction.commit()

  console.log('Done.\n')
  console.log('Next steps:')
  console.log('  1. Open /studio and check each document.')
  console.log('  2. Upload images — the seed imports text only, not photographs.')
  console.log('  3. Confirm the postal address in Site settings (the old site had three).')
  console.log('  4. Confirm consent is on file for every published story.')
}

run().catch((error) => {
  console.error('Import failed:', error)
  process.exit(1)
})
