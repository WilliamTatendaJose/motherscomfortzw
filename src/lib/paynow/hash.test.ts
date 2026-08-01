import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { hashValues, parsePaynowResponse, verifyHash } from './hash'

/** Independent reference implementation, mirroring Paynow's documented steps. */
function referenceHash(values: Record<string, string>, key: string) {
  const concatenated = Object.entries(values)
    .filter(([name]) => name !== 'hash')
    .map(([, value]) => value)
    .join('')
  return createHash('sha512')
    .update(concatenated + key.toLowerCase(), 'utf8')
    .digest('hex')
    .toUpperCase()
}

const INTEGRATION_KEY = '3e9fed89-6c2e-40b1-a2a1-2d9d0dd0dbe0'

const sampleFields = {
  resulturl: 'https://motherscomfort.co.zw/api/paynow/result',
  returnurl: 'https://motherscomfort.co.zw/donate/return',
  reference: 'MC-1730000000000-A1B2C3',
  amount: '25.00',
  id: '12345',
  additionalinfo: 'Donation to Mother%27s Comfort',
  authemail: 'donor@example.com',
  status: 'Message',
}

describe('hashValues', () => {
  it('produces an uppercase 128-character hex digest', () => {
    const hash = hashValues(sampleFields, INTEGRATION_KEY)
    expect(hash).toMatch(/^[0-9A-F]{128}$/)
  })

  it('matches an independent implementation of the documented algorithm', () => {
    expect(hashValues(sampleFields, INTEGRATION_KEY)).toBe(
      referenceHash(sampleFields, INTEGRATION_KEY),
    )
  })

  it('lowercases the integration key before appending it', () => {
    expect(hashValues(sampleFields, INTEGRATION_KEY.toUpperCase())).toBe(
      hashValues(sampleFields, INTEGRATION_KEY),
    )
  })

  it('excludes any existing hash field from the digest', () => {
    const withHash = { ...sampleFields, hash: 'PREVIOUS' }
    expect(hashValues(withHash, INTEGRATION_KEY)).toBe(hashValues(sampleFields, INTEGRATION_KEY))
  })

  it('depends on field order, not just field values', () => {
    const reordered = {
      returnurl: sampleFields.returnurl,
      resulturl: sampleFields.resulturl,
      reference: sampleFields.reference,
      amount: sampleFields.amount,
      id: sampleFields.id,
      additionalinfo: sampleFields.additionalinfo,
      authemail: sampleFields.authemail,
      status: sampleFields.status,
    }
    expect(hashValues(reordered, INTEGRATION_KEY)).not.toBe(
      hashValues(sampleFields, INTEGRATION_KEY),
    )
  })

  it('changes when the amount changes', () => {
    const tampered = { ...sampleFields, amount: '1.00' }
    expect(hashValues(tampered, INTEGRATION_KEY)).not.toBe(
      hashValues(sampleFields, INTEGRATION_KEY),
    )
  })
})

describe('verifyHash', () => {
  const signed = { ...sampleFields, hash: hashValues(sampleFields, INTEGRATION_KEY) }

  it('accepts a correctly signed payload', () => {
    expect(verifyHash(signed, INTEGRATION_KEY)).toBe(true)
  })

  it('rejects a payload with no hash', () => {
    expect(verifyHash(sampleFields, INTEGRATION_KEY)).toBe(false)
  })

  it('rejects a tampered amount — the case that matters', () => {
    expect(verifyHash({ ...signed, amount: '9999.00' }, INTEGRATION_KEY)).toBe(false)
  })

  it('rejects a tampered status', () => {
    const callback = {
      reference: sampleFields.reference,
      paynowreference: '1234567',
      amount: '25.00',
      status: 'Cancelled',
      pollurl: 'https://www.paynow.co.zw/Interface/CheckPayment/?guid=abc',
    }
    const legitimate = { ...callback, hash: hashValues(callback, INTEGRATION_KEY) }

    expect(verifyHash(legitimate, INTEGRATION_KEY)).toBe(true)
    expect(verifyHash({ ...legitimate, status: 'Paid' }, INTEGRATION_KEY)).toBe(false)
  })

  it('rejects a hash signed with a different integration key', () => {
    expect(verifyHash(signed, 'a-different-key')).toBe(false)
  })

  it('rejects a truncated hash without throwing', () => {
    expect(verifyHash({ ...signed, hash: signed.hash.slice(0, 64) }, INTEGRATION_KEY)).toBe(false)
  })
})

describe('parsePaynowResponse', () => {
  it('parses a standard Paynow reply', () => {
    const parsed = parsePaynowResponse(
      'status=Ok&browserurl=https%3a%2f%2fwww.paynow.co.zw%2fPayment%2fLink%2f%3fguid%3dabc&pollurl=https%3a%2f%2fwww.paynow.co.zw%2fInterface%2fCheckPayment%2f%3fguid%3dabc&hash=ABC123',
    )

    expect(parsed.status).toBe('Ok')
    expect(parsed.browserurl).toBe('https://www.paynow.co.zw/Payment/Link/?guid=abc')
    expect(parsed.pollurl).toBe('https://www.paynow.co.zw/Interface/CheckPayment/?guid=abc')
    expect(parsed.hash).toBe('ABC123')
  })

  it('treats + as a space', () => {
    expect(parsePaynowResponse('status=Awaiting+Delivery').status).toBe('Awaiting Delivery')
  })

  it('tolerates a stray percent sign rather than throwing', () => {
    expect(() => parsePaynowResponse('error=Invalid+amount+100%+off')).not.toThrow()
    expect(parsePaynowResponse('error=100%+off').error).toBe('100% off')
  })

  it('handles a leading question mark and empty values', () => {
    const parsed = parsePaynowResponse('?status=Error&error=')
    expect(parsed.status).toBe('Error')
    expect(parsed.error).toBe('')
  })

  it('keeps values containing an equals sign intact', () => {
    expect(parsePaynowResponse('pollurl=https://x.co/?guid=a=b').pollurl).toBe(
      'https://x.co/?guid=a=b',
    )
  })
})
