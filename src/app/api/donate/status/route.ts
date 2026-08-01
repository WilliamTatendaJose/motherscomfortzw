import { NextResponse } from 'next/server'

import { findDonation, updateDonationStatus } from '@/lib/donations'
import { isPaynowConfigured, pollTransaction } from '@/lib/paynow/client'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { FAILED_STATUSES, PAID_STATUSES } from '@/lib/paynow/types'

/**
 * Status for the donor's return page.
 *
 * The poll URL comes from our own stored record rather than the query string,
 * so this cannot be used to make the server fetch an arbitrary URL. Only the
 * coarse outcome is returned — never the poll URL or anything else internal.
 */
export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ ok: false, state: 'unknown' }, { status: 400 })
  }

  const { allowed } = rateLimit(`status:${clientIp(request)}`, {
    limit: 60,
    windowMs: 5 * 60 * 1000,
  })

  if (!allowed) {
    return NextResponse.json({ ok: false, state: 'pending' }, { status: 429 })
  }

  const donation = await findDonation(reference)

  if (!donation) {
    // Either storage is not configured or the reference is bogus. Either way we
    // cannot confirm anything, so say so rather than implying failure.
    return NextResponse.json({ ok: true, state: 'unknown', amount: null })
  }

  const settled = (status: string) =>
    PAID_STATUSES.has(status.toLowerCase()) || FAILED_STATUSES.has(status.toLowerCase())

  // If the webhook already settled it, trust the stored value and skip the poll.
  if (!settled(donation.status) && donation.pollUrl && isPaynowConfigured()) {
    const polled = await pollTransaction(donation.pollUrl)

    if (polled.ok) {
      await updateDonationStatus(reference, {
        status: polled.status,
        paynowReference: polled.paynowReference,
        paid: PAID_STATUSES.has(polled.status.toLowerCase()),
      })
      donation.status = polled.status
    }
  }

  const normalised = donation.status.toLowerCase()
  const state = PAID_STATUSES.has(normalised)
    ? 'paid'
    : FAILED_STATUSES.has(normalised)
      ? 'failed'
      : 'pending'

  return NextResponse.json({
    ok: true,
    state,
    status: donation.status,
    amount: donation.amount,
    tierLabel: donation.tierLabel,
  })
}
