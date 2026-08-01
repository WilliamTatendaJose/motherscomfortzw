import 'server-only'

import { createClient, type SanityClient } from 'next-sanity'

import { isSanityConfigured, sanityApiVersion, sanityProjectId, serverEnv } from '@/lib/env'

/**
 * Write client for records the *site* creates rather than editors: donations
 * and form submissions.
 *
 * These live in their own dataset (`SANITY_DONATIONS_DATASET`, default
 * `donations`) so donor and enquirer personal data is not sitting in the
 * content dataset that every editor browses. Create it as a **private** dataset:
 *
 *   npx sanity dataset create donations --visibility private
 *
 * Never import this from a client component — the token would be exposed.
 */

const token = serverEnv('SANITY_WRITE_TOKEN')
const dataset = serverEnv('SANITY_DONATIONS_DATASET') || 'donations'

export const canPersist = Boolean(isSanityConfigured && token)

export const writeClient: SanityClient | null = canPersist
  ? createClient({
      projectId: sanityProjectId,
      dataset,
      apiVersion: sanityApiVersion,
      token,
      useCdn: false,
    })
  : null

/**
 * Persist a document, returning null on failure.
 *
 * Storage must never be the reason a donor loses their payment or a visitor
 * loses their message: callers log and carry on. For donations the Paynow
 * reference is still returned to the browser and the transaction still
 * completes, and the result webhook logs loudly if it cannot find the record.
 */
export async function persist<T extends Record<string, unknown>>(
  doc: T & { _type: string },
): Promise<{ _id: string } | null> {
  if (!writeClient) {
    console.warn(
      `[sanity] not persisting ${doc._type}: SANITY_WRITE_TOKEN or project id is not configured`,
    )
    return null
  }

  try {
    const created = await writeClient.create(doc)
    return { _id: created._id }
  } catch (error) {
    console.error(`[sanity] failed to persist ${doc._type}`, error)
    return null
  }
}
