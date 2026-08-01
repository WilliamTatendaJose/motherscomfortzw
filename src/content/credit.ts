/**
 * Developer credit shown in the footer.
 *
 * A discreet "Website by …" line is standard practice — the template this site
 * replaced carried one too ("Designed By HTML Codex"). It is deliberately kept
 * to a single small line in the footer bottom bar so it never competes with the
 * charity's own message.
 *
 * TO ACTIVATE: set `whatsapp` below to Techrehub's number in international
 * format, e.g. '+263771234567'. While it is blank the credit still renders, but
 * as plain text rather than a link — so a half-configured credit can never ship
 * as a dead link.
 */
export const developerCredit = {
  name: 'Techrehub',

  /** International format. Leave blank to render the credit as plain text. */
  whatsapp: '',

  /**
   * Prefilled WhatsApp message. It names this site, which is how Techrehub
   * knows a lead came from here — the WhatsApp equivalent of a UTM tag.
   */
  enquiryMessage:
    "Hi Techrehub, I saw the Mother's Comfort website and I'd like to talk about a website for my organisation.",
}

/**
 * Builds the wa.me link, or returns null when no usable number is configured
 * so the caller renders plain text instead of a broken link.
 */
export function whatsappEnquiryLink(number: string, message: string): string | null {
  const digits = number.replace(/[^\d]/g, '')
  // wa.me needs a full international number; anything shorter is a typo or a
  // local-format number that would resolve to the wrong country.
  if (digits.length < 9) return null

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
