import 'server-only'

import { randomBytes } from 'node:crypto'

import { CUSTOM_AMOUNT_MAX, CUSTOM_AMOUNT_MIN } from '@/content/donations'
import { getDonationTiers } from '@/lib/content'
import { writeClient } from '@/lib/sanity/writeClient'
import type { PaynowMethod } from '@/lib/paynow/types'

/**
 * Donation persistence, kept behind this one module so the storage backend can
 * change without touching the route handlers. Today that backend is a private
 * Sanity dataset; moving to Postgres later means rewriting only this file.
 */

export type DonationRecord = {
  _id?: string
  reference: string
  amount: number
  currency: 'USD'
  tierId: string | null
  tierLabel: string | null
  donorName: string | null
  /** Null when the donor gave only a phone number — common here. */
  donorEmail: string | null
  method: PaynowMethod
  phone: string | null
  note: string | null
  status: string
  pollUrl: string | null
  paynowReference: string | null
  createdAt: string
  paidAt: string | null
}

/** `MC-<base36 time>-<random>`; unique, sortable, and readable in a bank statement. */
export function createReference(): string {
  return `MC-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`
}

/**
 * Determines the amount to actually charge.
 *
 * The browser's number is never trusted. If a tier was chosen, the price comes
 * from the tier definition; otherwise the custom amount is clamped to the
 * allowed range and rounded to cents. This is the control that stops someone
 * editing the DOM to donate $0.01 against a $120 tier, or posting a negative
 * amount.
 */
export async function resolveAmount(
  tierId: string | undefined | null,
  requestedAmount: number,
): Promise<{ amount: number; tierId: string | null; tierLabel: string | null } | null> {
  if (tierId) {
    const tiers = await getDonationTiers()
    const tier = tiers.find((candidate) => candidate._id === tierId)
    if (!tier) return null
    return { amount: tier.amount, tierId: tier._id, tierLabel: tier.label }
  }

  const amount = Math.round(requestedAmount * 100) / 100
  if (!Number.isFinite(amount) || amount < CUSTOM_AMOUNT_MIN || amount > CUSTOM_AMOUNT_MAX) {
    return null
  }

  return { amount, tierId: null, tierLabel: null }
}

export async function createDonation(record: DonationRecord): Promise<void> {
  if (!writeClient) {
    console.warn('[donations] no write client — donation not recorded', record.reference)
    return
  }

  try {
    await writeClient.create({ _type: 'donation', ...record })
  } catch (error) {
    // Deliberately non-fatal: the donor's payment is already under way and
    // failing here would lose them the transaction. The result webhook logs
    // loudly if it later cannot find this record.
    console.error('[donations] failed to record donation', record.reference, error)
  }
}

export async function findDonation(reference: string): Promise<DonationRecord | null> {
  if (!writeClient) return null

  try {
    return await writeClient.fetch<DonationRecord | null>(
      `*[_type == "donation" && reference == $reference][0]`,
      { reference },
    )
  } catch (error) {
    console.error('[donations] lookup failed', reference, error)
    return null
  }
}

/**
 * Applies a status update. Idempotent: Paynow retries its callback, and a
 * repeated "Paid" must not move `paidAt` or double-count anything downstream.
 */
export async function updateDonationStatus(
  reference: string,
  update: { status: string; paynowReference?: string | null; paid: boolean },
): Promise<void> {
  if (!writeClient) return

  const existing = await findDonation(reference)
  if (!existing?._id) {
    console.error('[donations] no record found for reference', reference)
    return
  }

  if (existing.status === update.status && existing.paynowReference) {
    return
  }

  const patch: Record<string, unknown> = { status: update.status }
  if (update.paynowReference) patch.paynowReference = update.paynowReference
  // Only stamp paidAt the first time it becomes paid.
  if (update.paid && !existing.paidAt) patch.paidAt = new Date().toISOString()

  try {
    await writeClient.patch(existing._id).set(patch).commit()
  } catch (error) {
    console.error('[donations] failed to update status', reference, error)
  }
}
