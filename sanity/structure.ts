import type { StructureResolver } from 'sanity/structure'

import { ReconciliationPanel } from './components/ReconciliationPanel'

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

/**
 * Status values as Paynow returns them, lower-cased for comparison. Kept in
 * sync with PAID_STATUSES / FAILED_STATUSES in src/lib/paynow/types.ts — the
 * Studio cannot import from src, so changing one means changing both.
 */
const PAID = '["paid", "awaiting delivery", "delivered"]'
const FAILED = '["cancelled", "failed", "disputed", "refunded"]'

/** Test-mode payments moved no money, so they are never income. */
const NOT_TEST = 'isTest != true'

const byNewest = { field: 'createdAt', direction: 'desc' } as const
const byReceived = { field: 'receivedAt', direction: 'desc' } as const

/**
 * Read-only log of what the website itself has written.
 *
 * Split by payment status because reconciliation only ever cares about money
 * that actually arrived. A donor who opens the form and abandons it still
 * leaves a "Created" record behind, so a single flat list overstates income —
 * of the first four records here, two were abandoned.
 */
export const recordsStructure: StructureResolver = (S) =>
  S.list()
    .title('Records')
    .items([
      S.listItem()
        .title('Summary & export')
        .id('summary')
        .child(S.component(ReconciliationPanel).id('summary').title('Summary & export')),

      S.divider(),

      S.listItem()
        .title('Online donations (Paynow)')
        .child(
          S.list()
            .title('Online donations')
            .items([
              S.listItem()
                .title('Received')
                .child(
                  S.documentList()
                    .title('Received')
                    .filter(`_type == "donation" && lower(status) in ${PAID} && ${NOT_TEST}`)
                    .defaultOrdering([byNewest]),
                ),
              S.listItem()
                .title('Awaiting payment')
                .child(
                  S.documentList()
                    .title('Awaiting payment')
                    .filter(
                      `_type == "donation" && !(lower(status) in ${PAID}) && !(lower(status) in ${FAILED}) && ${NOT_TEST}`,
                    )
                    .defaultOrdering([byNewest]),
                ),
              S.listItem()
                .title('Failed or cancelled')
                .child(
                  S.documentList()
                    .title('Failed or cancelled')
                    .filter(`_type == "donation" && lower(status) in ${FAILED} && ${NOT_TEST}`)
                    .defaultOrdering([byNewest]),
                ),
              S.divider(),
              S.listItem()
                .title('Test transactions')
                .child(
                  S.documentList()
                    .title('Test transactions — no real money')
                    .filter('_type == "donation" && isTest == true')
                    .defaultOrdering([byNewest]),
                ),
              S.listItem()
                .title('All online donations')
                .child(
                  S.documentList()
                    .title('All online donations')
                    .filter('_type == "donation"')
                    .defaultOrdering([byNewest]),
                ),
            ]),
        ),

      S.listItem()
        .title('Offline donations')
        .child(
          S.documentList()
            .title('Offline donations')
            .schemaType('offlineDonation')
            .filter('_type == "offlineDonation"')
            .defaultOrdering([byReceived]),
        ),

      S.divider(),

      S.documentTypeListItem('submission').title('Form submissions'),
    ])
