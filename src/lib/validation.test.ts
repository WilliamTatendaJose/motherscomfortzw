import { describe, expect, it } from 'vitest'

import {
  contactSchema,
  donationSchema,
  isZimbabweMobile,
  newsletterSchema,
  toLocalMobile,
} from './validation'

describe('donationSchema', () => {
  const valid = { amount: 25, email: 'donor@example.com', method: 'web' as const }

  it('accepts a straightforward web donation', () => {
    expect(donationSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a zero or negative amount', () => {
    expect(donationSchema.safeParse({ ...valid, amount: 0 }).success).toBe(false)
    expect(donationSchema.safeParse({ ...valid, amount: -100 }).success).toBe(false)
  })

  it('rejects an amount above the ceiling', () => {
    expect(donationSchema.safeParse({ ...valid, amount: 10_001 }).success).toBe(false)
  })

  it('rejects a missing or malformed email', () => {
    expect(donationSchema.safeParse({ ...valid, email: '' }).success).toBe(false)
    expect(donationSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
  })

  it('requires a phone number for mobile money, but not for the web flow', () => {
    expect(donationSchema.safeParse({ ...valid, method: 'ecocash' }).success).toBe(false)
    expect(
      donationSchema.safeParse({ ...valid, method: 'ecocash', phone: '0771234567' }).success,
    ).toBe(true)
  })

  it('rejects a non-Zimbabwean number for mobile money', () => {
    expect(
      donationSchema.safeParse({ ...valid, method: 'ecocash', phone: '+44 7700 900000' }).success,
    ).toBe(false)
  })

  it('rejects an unknown payment method', () => {
    expect(donationSchema.safeParse({ ...valid, method: 'bitcoin' }).success).toBe(false)
  })

  it('rejects a submission with the honeypot filled', () => {
    expect(donationSchema.safeParse({ ...valid, website: 'http://spam.example' }).success).toBe(
      false,
    )
  })

  it('coerces a numeric string, since forms post strings', () => {
    const parsed = donationSchema.safeParse({ ...valid, amount: '25.50' })
    expect(parsed.success && parsed.data.amount).toBe(25.5)
  })
})

describe('isZimbabweMobile', () => {
  it.each(['0771234567', '0712345678', '0782345678', '263771234567', '+263771234567'])(
    'accepts %s',
    (value) => expect(isZimbabweMobile(value)).toBe(true),
  )

  it('accepts numbers with spaces or dashes', () => {
    expect(isZimbabweMobile('077 123 4567')).toBe(true)
    expect(isZimbabweMobile('077-123-4567')).toBe(true)
  })

  it.each(['', '077123456', '07712345678', '0891234567', '+447700900000', 'not a number'])(
    'rejects %s',
    (value) => expect(isZimbabweMobile(value)).toBe(false),
  )
})

describe('toLocalMobile', () => {
  it('normalises every accepted format to the local 07 form', () => {
    expect(toLocalMobile('+263771234567')).toBe('0771234567')
    expect(toLocalMobile('263771234567')).toBe('0771234567')
    expect(toLocalMobile('077 123 4567')).toBe('0771234567')
    expect(toLocalMobile('0771234567')).toBe('0771234567')
  })
})

describe('contactSchema', () => {
  const valid = {
    name: 'Tendai Moyo',
    email: 'tendai@example.com',
    subject: 'Donation drive',
    message: 'I would like to run a collection at my workplace.',
  }

  it('accepts a complete message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a message that is too short to act on', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    const parsed = contactSchema.safeParse({ ...valid, name: '  Tendai Moyo  ' })
    expect(parsed.success && parsed.data.name).toBe('Tendai Moyo')
  })

  it('rejects a filled honeypot', () => {
    expect(contactSchema.safeParse({ ...valid, website: 'x' }).success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  it('accepts an email and rejects a blank one', () => {
    expect(newsletterSchema.safeParse({ email: 'a@b.co' }).success).toBe(true)
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false)
  })
})
