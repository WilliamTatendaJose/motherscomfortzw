import 'server-only'

import { requireServerEnv, serverEnv, siteUrl } from '@/lib/env'

import { hashValues, parsePaynowResponse, verifyHash } from './hash'
import type {
  PaynowInitiateResult,
  PaynowPayment,
  PaynowStatusResult,
} from './types'

const URL_INITIATE = 'https://www.paynow.co.zw/interface/initiatetransaction'
const URL_REMOTE = 'https://www.paynow.co.zw/interface/remotetransaction'
const INNBUCKS_DEEPLINK_PREFIX = 'schinn.wbpycode://innbucks.co.zw?pymInnCode='

const REQUEST_TIMEOUT_MS = 15_000

export function isPaynowConfigured(): boolean {
  return Boolean(serverEnv('PAYNOW_INTEGRATION_ID') && serverEnv('PAYNOW_INTEGRATION_KEY'))
}

function credentials() {
  return {
    id: requireServerEnv('PAYNOW_INTEGRATION_ID'),
    key: requireServerEnv('PAYNOW_INTEGRATION_KEY'),
  }
}

/**
 * Field order is part of the hash contract — see `hash.ts`. These orders match
 * Paynow's SDK exactly and must not be rearranged, even though the names look
 * arbitrary. Note `resulturl` comes first, not `id`.
 */
function buildFields(payment: PaynowPayment, integrationId: string, key: string) {
  const resultUrl = serverEnv('PAYNOW_RESULT_URL') || `${siteUrl}/api/paynow/result`
  const returnUrl =
    serverEnv('PAYNOW_RETURN_URL') ||
    `${siteUrl}/donate/return?reference=${encodeURIComponent(payment.reference)}`

  const base: Record<string, string> = {
    resulturl: resultUrl,
    returnurl: returnUrl,
    reference: payment.reference,
    amount: payment.amount.toFixed(2),
    id: integrationId,
    additionalinfo: payment.additionalInfo,
    authemail: payment.authEmail,
  }

  // Express Checkout inserts phone and method *before* status.
  const fields: Record<string, string> =
    payment.method === 'web'
      ? { ...base, status: 'Message' }
      : { ...base, phone: payment.phone ?? '', method: payment.method, status: 'Message' }

  // Paynow hashes the encodeURI-transformed values, which is what its server
  // sees once it form-decodes the request body.
  const encoded: Record<string, string> = {}
  for (const [name, value] of Object.entries(fields)) {
    encoded[name] = encodeURI(value)
  }
  encoded.hash = hashValues(encoded, key)

  return encoded
}

async function postForm(url: string, fields: Record<string, string>): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Paynow returned HTTP ${response.status}`)
  }

  return response.text()
}

/**
 * Starts a transaction. For `web` the caller redirects the donor to
 * `redirectUrl`; for Express Checkout the donor approves on their handset and
 * the caller polls `pollUrl`.
 */
export async function initiateTransaction(
  payment: PaynowPayment,
): Promise<PaynowInitiateResult> {
  const { id, key } = credentials()
  const fields = buildFields(payment, id, key)
  const url = payment.method === 'web' ? URL_INITIATE : URL_REMOTE

  let parsed: Record<string, string>
  try {
    parsed = parsePaynowResponse(await postForm(url, fields))
  } catch (error) {
    console.error('[paynow] initiate request failed', error)
    return { ok: false, error: 'We could not reach Paynow. Please try again in a moment.' }
  }

  const status = (parsed.status ?? '').toLowerCase()

  if (status !== 'ok') {
    // Paynow puts the reason in `error`; log it but don't show donors raw
    // gateway text.
    console.error('[paynow] initiate rejected', { status, error: parsed.error })
    return {
      ok: false,
      error: parsed.error || 'Paynow could not start this payment. Please try again.',
    }
  }

  if (!verifyHash(parsed, key)) {
    console.error('[paynow] initiate response failed hash verification')
    return { ok: false, error: 'We could not verify the response from Paynow. Please try again.' }
  }

  if (!parsed.pollurl) {
    return { ok: false, error: 'Paynow did not return a poll URL.' }
  }

  const authorisationCode = parsed.authorizationcode ?? parsed.authorisationcode ?? null

  return {
    ok: true,
    redirectUrl: parsed.browserurl ?? null,
    pollUrl: parsed.pollurl,
    instructions: parsed.instructions ?? null,
    innbucks: authorisationCode
      ? {
          authorisationCode,
          deepLink: `${INNBUCKS_DEEPLINK_PREFIX}${authorisationCode}`,
        }
      : null,
  }
}

/**
 * Polls a transaction. `pollUrl` always comes from our own stored record, never
 * from the browser, so a caller cannot point this at an arbitrary host.
 */
export async function pollTransaction(pollUrl: string): Promise<PaynowStatusResult> {
  const { key } = credentials()

  if (!pollUrl.startsWith('https://www.paynow.co.zw/')) {
    return { ok: false, error: 'Refusing to poll a non-Paynow URL.' }
  }

  let parsed: Record<string, string>
  try {
    const response = await fetch(pollUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    parsed = parsePaynowResponse(await response.text())
  } catch (error) {
    console.error('[paynow] poll failed', error)
    return { ok: false, error: 'Could not reach Paynow.' }
  }

  if (!verifyHash(parsed, key)) {
    console.error('[paynow] poll response failed hash verification')
    return { ok: false, error: 'Could not verify the response from Paynow.' }
  }

  const amount = Number.parseFloat(parsed.amount ?? '')

  return {
    ok: true,
    status: parsed.status ?? 'Unknown',
    amount: Number.isFinite(amount) ? amount : null,
    paynowReference: parsed.paynowreference ?? null,
  }
}

/** Verifies an inbound result-URL callback. Exported for the webhook route. */
export function verifyCallback(values: Record<string, string>): boolean {
  const { key } = credentials()
  return verifyHash(values, key)
}
