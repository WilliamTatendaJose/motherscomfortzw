import { NextResponse } from 'next/server'

import { updateDonationStatus } from '@/lib/donations'
import { verifyCallback } from '@/lib/paynow/client'
import { isPaynowConfigured } from '@/lib/paynow/client'
import { parsePaynowResponse } from '@/lib/paynow/hash'
import { FAILED_STATUSES, PAID_STATUSES } from '@/lib/paynow/types'

/**
 * Paynow's Result URL (IPN).
 *
 * This endpoint is called server-to-server by Paynow and therefore cannot be
 * authenticated in the usual way — it is public by necessity. The hash check
 * below is the *only* thing that makes a "Paid" callback trustworthy, so it
 * runs before anything is read out of the body. Anyone on the internet can POST
 * here; without a valid hash, nothing happens.
 *
 * Paynow retries until it gets a 200, so the handler is idempotent and returns
 * 200 for anything it has already processed.
 */
export async function POST(request: Request) {
  if (!isPaynowConfigured()) {
    console.error('[paynow] result callback received but Paynow is not configured')
    return new NextResponse('Not configured', { status: 503 })
  }

  let values: Record<string, string>
  try {
    // Paynow posts application/x-www-form-urlencoded, not JSON.
    values = parsePaynowResponse(await request.text())
  } catch (error) {
    console.error('[paynow] could not parse result callback', error)
    return new NextResponse('Bad request', { status: 400 })
  }

  if (!verifyCallback(values)) {
    console.error('[paynow] result callback failed hash verification', {
      reference: values.reference,
    })
    return new NextResponse('Invalid hash', { status: 400 })
  }

  const reference = values.reference
  if (!reference) {
    return new NextResponse('Missing reference', { status: 400 })
  }

  const status = values.status ?? 'Unknown'
  const normalised = status.toLowerCase()

  await updateDonationStatus(reference, {
    status,
    paynowReference: values.paynowreference ?? null,
    paid: PAID_STATUSES.has(normalised),
  })

  if (!PAID_STATUSES.has(normalised) && !FAILED_STATUSES.has(normalised)) {
    // Created / Sent — the donor has not finished yet. Acknowledge so Paynow
    // stops retrying this particular notification.
    console.info('[paynow] interim status', { reference, status })
  }

  return new NextResponse('OK', { status: 200 })
}
