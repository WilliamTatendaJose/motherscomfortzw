import { NextResponse } from 'next/server'

import { createDonation, createReference, resolveAmount } from '@/lib/donations'
import { serverEnv } from '@/lib/env'
import { initiateTransaction, isPaynowConfigured } from '@/lib/paynow/client'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { donationSchema, fieldErrors, toLocalMobile } from '@/lib/validation'

/**
 * Paynow requires an `authemail` on Express Checkout (its SDK rejects the
 * transaction without a valid one) even though donors here often have no email.
 * When a donor does not give one we send the charity's own address, so the
 * transaction succeeds and the receipt reaches the charity rather than nobody.
 * This is also the address Paynow's test mode expects.
 */
function authEmailFor(donorEmail: string | undefined): string {
  return (
    donorEmail?.trim() ||
    serverEnv('PAYNOW_FALLBACK_EMAIL') ||
    serverEnv('CONTACT_NOTIFY_EMAIL') ||
    'info@motherscomfort.co.zw'
  )
}

export async function POST(request: Request) {
  if (!isPaynowConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Online payments are not set up yet. Please use one of the other ways to give, or contact us on WhatsApp.',
      },
      { status: 503 },
    )
  }

  // Card-testing and abuse guard. Deliberately tighter than the contact forms.
  const { allowed, retryAfterSeconds } = rateLimit(`donate:${clientIp(request)}`, {
    limit: 8,
    windowMs: 10 * 60 * 1000,
  })

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many attempts. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  const parsed = donationSchema.safeParse(body)

  if (!parsed.success) {
    const errors = fieldErrors(parsed.error)
    if (errors.website) {
      return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
    }
    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields.', errors },
      { status: 400 },
    )
  }

  const input = parsed.data

  // The charge is re-derived server-side; whatever amount the browser sent is
  // only a hint. See resolveAmount().
  const resolved = await resolveAmount(input.tierId || null, input.amount)

  if (!resolved) {
    return NextResponse.json(
      { ok: false, message: 'That donation amount is not valid.', errors: { amount: 'Invalid amount' } },
      { status: 400 },
    )
  }

  const reference = createReference()
  const description = resolved.tierLabel
    ? `Donation: ${resolved.tierLabel}`
    : "Donation to Mother's Comfort"

  const result = await initiateTransaction({
    reference,
    amount: resolved.amount,
    additionalInfo: description,
    authEmail: authEmailFor(input.email),
    method: input.method,
    phone: input.phone ? toLocalMobile(input.phone) : undefined,
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.error }, { status: 502 })
  }

  await createDonation({
    reference,
    amount: resolved.amount,
    currency: 'USD',
    tierId: resolved.tierId,
    tierLabel: resolved.tierLabel,
    donorName: input.name || null,
    donorEmail: input.email || null,
    method: input.method,
    phone: input.phone ? toLocalMobile(input.phone) : null,
    note: input.note || null,
    status: 'Created',
    pollUrl: result.pollUrl,
    paynowReference: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  })

  return NextResponse.json({
    ok: true,
    reference,
    amount: resolved.amount,
    // Present for the web flow; null for Express Checkout.
    redirectUrl: result.redirectUrl,
    instructions: result.instructions,
    innbucks: result.innbucks,
  })
}
