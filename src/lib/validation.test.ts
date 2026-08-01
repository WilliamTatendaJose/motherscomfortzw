import { describe, expect, it } from 'vitest'

import {
  contactSchema,
  donationSchema,
  isValidPhone,
  isZimbabweMobile,
  newsletterSchema,
  toLocalMobile,
  volunteerSchema,
} from './validation'

describe('donationSchema', () => {
  const byPhone = { amount: 25, phone: '0771234567', method: 'web' as const }
  const byEmail = { amount: 25, email: 'donor@example.com', method: 'web' as const }

  it('accepts a donation with only a phone number', () => {
    expect(donationSchema.safeParse(byPhone).success).toBe(true)
  })

  it('accepts a donation with only an email', () => {
    expect(donationSchema.safeParse(byEmail).success).toBe(true)
  })

  it('accepts a foreign number, for diaspora donors paying by card', () => {
    expect(
      donationSchema.safeParse({ ...byPhone, phone: '+44 7700 900123' }).success,
    ).toBe(true)
  })

  it('rejects a donation with no way to reach the donor at all', () => {
    const parsed = donationSchema.safeParse({ amount: 25, method: 'web' })
    expect(parsed.success).toBe(false)
    expect(parsed.success === false && parsed.error.issues[0].message).toMatch(/phone number or an email/)
  })

  it('rejects a malformed email even though email is optional', () => {
    expect(donationSchema.safeParse({ ...byPhone, email: 'not-an-email' }).success).toBe(false)
  })

  it('rejects a zero or negative amount', () => {
    expect(donationSchema.safeParse({ ...byPhone, amount: 0 }).success).toBe(false)
    expect(donationSchema.safeParse({ ...byPhone, amount: -100 }).success).toBe(false)
  })

  it('rejects an amount above the ceiling', () => {
    expect(donationSchema.safeParse({ ...byPhone, amount: 10_001 }).success).toBe(false)
  })

  it('requires a Zimbabwean mobile for mobile money, with or without an email', () => {
    expect(donationSchema.safeParse({ ...byEmail, method: 'ecocash' }).success).toBe(false)
    expect(
      donationSchema.safeParse({ ...byEmail, method: 'ecocash', phone: '+44 7700 900123' }).success,
    ).toBe(false)
    expect(
      donationSchema.safeParse({ amount: 25, method: 'ecocash', phone: '0771234567' }).success,
    ).toBe(true)
  })

  it('rejects an unknown payment method', () => {
    expect(donationSchema.safeParse({ ...byPhone, method: 'bitcoin' }).success).toBe(false)
  })

  it('rejects a submission with the honeypot filled', () => {
    expect(donationSchema.safeParse({ ...byPhone, website: 'http://spam.example' }).success).toBe(
      false,
    )
  })

  it('coerces a numeric string, since forms post strings', () => {
    const parsed = donationSchema.safeParse({ ...byPhone, amount: '25.50' })
    expect(parsed.success && parsed.data.amount).toBe(25.5)
  })
})

describe('isZimbabweMobile', () => {
  it.each(['0771234567', '0712345678', '0782345678', '263771234567', '+263771234567'])(
    'accepts %s',
    (value) => expect(isZimbabweMobile(value)).toBe(true),
  )

  it('accepts numbers with spaces, dashes or brackets', () => {
    expect(isZimbabweMobile('077 123 4567')).toBe(true)
    expect(isZimbabweMobile('077-123-4567')).toBe(true)
  })

  it.each(['', '077123456', '07712345678', '0891234567', '+447700900000', 'not a number'])(
    'rejects %s',
    (value) => expect(isZimbabweMobile(value)).toBe(false),
  )
})

describe('isValidPhone', () => {
  it('accepts local and international numbers', () => {
    expect(isValidPhone('0771234567')).toBe(true)
    expect(isValidPhone('+263 77 123 4567')).toBe(true)
    expect(isValidPhone('+44 7700 900123')).toBe(true)
    expect(isValidPhone('(077) 123-4567')).toBe(true)
  })

  it('rejects obvious typos and non-numbers', () => {
    expect(isValidPhone('12345')).toBe(false)
    expect(isValidPhone('not a phone')).toBe(false)
    expect(isValidPhone('07712345678901234')).toBe(false)
  })
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
  const base = {
    name: 'Tendai Moyo',
    subject: 'Donation drive',
    message: 'I would like to run a collection at my workplace.',
  }

  it('accepts a message with only a phone number', () => {
    expect(contactSchema.safeParse({ ...base, phone: '0771234567' }).success).toBe(true)
  })

  it('accepts a message with only an email', () => {
    expect(contactSchema.safeParse({ ...base, email: 'tendai@example.com' }).success).toBe(true)
  })

  it('rejects a message with no contact details at all', () => {
    expect(contactSchema.safeParse(base).success).toBe(false)
  })

  it('rejects a message that is too short to act on', () => {
    expect(contactSchema.safeParse({ ...base, phone: '0771234567', message: 'hi' }).success).toBe(
      false,
    )
  })

  it('trims surrounding whitespace', () => {
    const parsed = contactSchema.safeParse({
      ...base,
      phone: '0771234567',
      name: '  Tendai Moyo  ',
    })
    expect(parsed.success && parsed.data.name).toBe('Tendai Moyo')
  })

  it('rejects a filled honeypot', () => {
    expect(contactSchema.safeParse({ ...base, phone: '0771234567', website: 'x' }).success).toBe(
      false,
    )
  })
})

describe('volunteerSchema', () => {
  const base = { name: 'Rudo Chikwava', interest: 'volunteering' as const }

  it('accepts a phone number alone', () => {
    expect(volunteerSchema.safeParse({ ...base, phone: '0712345678' }).success).toBe(true)
  })

  it('rejects no contact details', () => {
    expect(volunteerSchema.safeParse(base).success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  it('still requires an email — it is what is being signed up', () => {
    expect(newsletterSchema.safeParse({ email: 'a@b.co' }).success).toBe(true)
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false)
    expect(newsletterSchema.safeParse({}).success).toBe(false)
  })
})
