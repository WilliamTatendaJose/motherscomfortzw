import { describe, expect, it } from 'vitest'

import { developerCredit, whatsappEnquiryLink } from './credit'

const MESSAGE = 'Hi Techrehub, I saw your work.'

describe('whatsappEnquiryLink', () => {
  it('builds a wa.me link from an international number', () => {
    expect(whatsappEnquiryLink('+263771234567', MESSAGE)).toBe(
      `https://wa.me/263771234567?text=${encodeURIComponent(MESSAGE)}`,
    )
  })

  it('strips spaces, dashes and brackets', () => {
    expect(whatsappEnquiryLink('+263 (77) 123-4567', MESSAGE)).toBe(
      whatsappEnquiryLink('+263771234567', MESSAGE),
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
    const link = whatsappEnquiryLink('+263771234567', "Mother's Comfort & co?")
    // encodeURIComponent leaves the apostrophe alone — it is legal in a URL —
    // but & and ? must be escaped or they would truncate the query string.
    expect(link).toContain("Mother's%20Comfort%20%26%20co%3F")
  })
})

describe('developerCredit config', () => {
  it('always has a name, so the credit line is never empty', () => {
    expect(developerCredit.name.trim().length).toBeGreaterThan(0)
  })

  it('names the source site in the enquiry message, for lead attribution', () => {
    expect(developerCredit.enquiryMessage).toMatch(/Mother's Comfort/)
  })
})
