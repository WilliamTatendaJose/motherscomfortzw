import type { StructureResolver } from 'sanity/structure'

/**
 * Desk layout. Singletons are pinned to a fixed document id so editors open the
 * one real "Home page" rather than being able to create a second, competing one.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

      S.divider(),

      S.listItem()
        .title('Home page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Donate page')
        .id('donatePage')
        .child(S.document().schemaType('donatePage').documentId('donatePage')),

      S.divider(),

      S.documentTypeListItem('story').title("Mothers' stories"),
      S.documentTypeListItem('programme').title('Programmes'),

      S.divider(),

      S.documentTypeListItem('donationTier').title('Donation tiers'),
      S.documentTypeListItem('inKindItem').title('In-kind items'),
      S.documentTypeListItem('impactStat').title('Impact statistics'),

      S.divider(),

      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('page').title('Other pages'),
    ])

/** Read-only log of what the website itself has written. */
export const recordsStructure: StructureResolver = (S) =>
  S.list()
    .title('Records')
    .items([
      S.documentTypeListItem('donation').title('Donations'),
      S.documentTypeListItem('submission').title('Form submissions'),
    ])
