import { describe, expect, it } from 'vitest'

import {
  developerCredit,
  developerCreditHref,
  websiteCreditLink,
  whatsappEnquiryLink,
} from './credit'

const MESSAGE = 'Hi Techrehub, I saw your work.'

describe('websiteCreditLink', () => {
  it('appends UTM tags so referrals show up in analytics', () => {
    const url = new URL(websiteCreditLink('https://www.techrehub.co.zw')!)
    expect(url.origin).toBe('https://www.techrehub.co.zw')
    expect(url.searchParams.get('utm_source')).toBe('motherscomfort.co.zw')
    expect(url.searchParams.get('utm_medium')).toBe('referral')
    expect(url.searchParams.get('utm_campaign')).toBe('footer-credit')
  })

  it('preserves an existing path and query', () => {
    const url = new URL(websiteCreditLink('https://www.techrehub.co.zw/work?ref=x')!)
    expect(url.pathname).toBe('/work')
    expect(url.searchParams.get('ref')).toBe('x')
    expect(url.searchParams.get('utm_source')).toBe('motherscomfort.co.zw')
  })

  it('returns null when unconfigured', () => {
    expect(websiteCreditLink('')).toBeNull()
    expect(websiteCreditLink('   ')).toBeNull()
  })

  it('returns null for a malformed URL rather than emitting a broken href', () => {
    expect(websiteCreditLink('techrehub.co.zw')).toBeNull()
    expect(websiteCreditLink('not a url')).toBeNull()
  })

  it('refuses non-http schemes, so nothing odd can reach an href', () => {
    expect(websiteCreditLink('javascript:alert(1)')).toBeNull()
    expect(websiteCreditLink('data:text/html,<script>')).toBeNull()
  })
})

describe('whatsappEnquiryLink', () => {
  it('builds a wa.me link from an international number', () => {
    expect(whatsappEnquiryLink('+263773447131', MESSAGE)).toBe(
      `https://wa.me/263773447131?text=${encodeURIComponent(MESSAGE)}`,
    )
  })

  it('strips spaces, dashes and brackets', () => {
    expect(whatsappEnquiryLink('+263 (77) 344-7131', MESSAGE)).toBe(
      whatsappEnquiryLink('+263773447131', MESSAGE),
    )
  })

  it('returns null when unconfigured, so the credit renders as plain text', () => {
    expect(whatsappEnquiryLink('', MESSAGE)).toBeNull()
    expect(whatsappEnquiryLink('   ', MESSAGE)).toBeNull()
  })

  it('returns null for a number too short to be international', () => {
    // A local-format number would resolve to the wrong country on wa.me.
    expect(whatsappEnquiryLink('0771234', MESSAGE)).toBeNull()
  })

  it('encodes the message so punctuation survives the URL', () => {
    const link = whatsappEnquiryLink('+263773447131', "Mother's Comfort & co?")
    // encodeURIComponent leaves the apostrophe alone — it is legal in a URL —
    // but & and ? must be escaped or they would truncate the query string.
    expect(link).toContain("Mother's%20Comfort%20%26%20co%3F")
  })
})

describe('developerCreditHref', () => {
  const base = {
    name: 'Techrehub',
    website: 'https://www.techrehub.co.zw',
    whatsapp: '+263773447131',
    enquiryMessage: MESSAGE,
  }

  it('prefers the website when both are configured', () => {
    expect(developerCreditHref(base)).toContain('techrehub.co.zw')
    expect(developerCreditHref(base)).not.toContain('wa.me')
  })

  it('falls back to WhatsApp when there is no website', () => {
    expect(developerCreditHref({ ...base, website: '' })).toContain('wa.me/263773447131')
  })

  it('falls back to WhatsApp when the website URL is unusable', () => {
    expect(developerCreditHref({ ...base, website: 'techrehub.co.zw' })).toContain('wa.me')
  })

  it('returns null when neither is configured, so the credit is plain text', () => {
    expect(developerCreditHref({ ...base, website: '', whatsapp: '' })).toBeNull()
  })
})

describe('developerCredit config', () => {
  it('always has a name, so the credit line is never empty', () => {
    expect(developerCredit.name.trim().length).toBeGreaterThan(0)
  })

  it('resolves to a real link as shipped', () => {
    expect(developerCreditHref()).toBeTruthy()
  })

  it('names the source site in the enquiry message, for lead attribution', () => {
    expect(developerCredit.enquiryMessage).toMatch(/Mother's Comfort/)
  })
})
