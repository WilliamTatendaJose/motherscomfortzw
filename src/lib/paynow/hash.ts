import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Paynow's message authentication.
 *
 * The scheme is unforgiving and every detail below was verified against
 * Paynow's own SDK — getting any one of them wrong yields an opaque
 * "hash mismatch" from their server:
 *
 *  1. Concatenate the field *values* in the exact order they are sent, with no
 *     separators and no key names. The `hash` field itself is excluded.
 *  2. Append the integration key **lowercased**.
 *  3. SHA-512, hex, **uppercased**.
 *
 * Outbound and inbound differ in one respect. Outbound, the values hashed are
 * the `encodeURI`-transformed ones (which is what Paynow's server sees after it
 * form-decodes the body). Inbound, the values hashed are the ones as they
 * arrive after form-decoding. `hashValues` therefore takes the values already
 * in the form the other side will see; the callers handle the transform.
 */

/** Order is load-bearing: JS objects preserve string-key insertion order. */
export function hashValues(values: Record<string, string>, integrationKey: string): string {
  let payload = ''
  for (const [key, value] of Object.entries(values)) {
    if (key === 'hash') continue
    payload += value
  }
  payload += integrationKey.toLowerCase()

  return createHash('sha512').update(payload, 'utf8').digest('hex').toUpperCase()
}

/**
 * Verifies a hash Paynow sent us. Used on the result webhook, which is a public
 * unauthenticated endpoint — this check is the *only* thing establishing that a
 * "Paid" callback actually came from Paynow.
 */
export function verifyHash(values: Record<string, string>, integrationKey: string): boolean {
  const received = values.hash
  if (!received) return false

  const expected = hashValues(values, integrationKey)

  // Both are fixed-length uppercase hex, so a length mismatch is already a
  // failure and timingSafeEqual can be used on the raw buffers.
  const a = Buffer.from(received, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false

  return timingSafeEqual(a, b)
}

/**
 * Paynow replies with an `application/x-www-form-urlencoded` body. Their own
 * parser treats `+` as a space and tolerates stray `%` that is not a valid
 * escape, so we match that rather than using URLSearchParams, which throws.
 */
export function parsePaynowResponse(body: string): Record<string, string> {
  const result: Record<string, string> = {}
  const trimmed = body.startsWith('?') ? body.slice(1) : body

  for (const pair of trimmed.split('&')) {
    if (!pair) continue
    const index = pair.indexOf('=')
    const rawKey = index === -1 ? pair : pair.slice(0, index)
    const rawValue = index === -1 ? '' : pair.slice(index + 1)
    result[decodeLoose(rawKey)] = decodeLoose(rawValue)
  }

  return result
}

function decodeLoose(value: string): string {
  return decodeURIComponent(value.replace(/%(?![\da-f]{2})/gi, '%25').replace(/\+/g, '%20'))
}
