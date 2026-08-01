/**
 * Developer credit shown in the footer.
 *
 * A discreet "Website by …" line is standard practice — the template this site
 * replaced carried one too ("Designed By HTML Codex"). It is deliberately kept
 * to a single small line in the footer bottom bar so it never competes with the
 * charity's own message.
 *
 * The credit links to the website when one is set, falling back to WhatsApp
 * otherwise, and renders as plain text if neither is configured — so a
 * half-configured credit can never ship as a dead link.
 */
export const developerCredit = {
  name: 'Techrehub',

  /** Preferred link target. Gets UTM tags so referrals are visible in analytics. */
  website: 'https://www.techrehub.co.zw',

  /** International format. Used only when `website` is blank. */
  whatsapp: '+263773447131',

  /**
   * Prefilled WhatsApp message, for the fallback path. It names this site,
   * which is how a lead gets attributed when there is no referrer to read.
   */
  enquiryMessage:
    "Hi Techrehub, I saw the Mother's Comfort website and I'd like to talk about a website for my organisation.",
}

/** Identifies this site as the referrer in the developer's analytics. */
const UTM = {
  utm_source: 'motherscomfort.co.zw',
  utm_medium: 'referral',
  utm_campaign: 'footer-credit',
}

export function websiteCreditLink(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    // Only http(s); anything else in a credit config is a mistake, and we do
    // not want a javascript: or data: URL reaching an href.
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null

    for (const [key, value] of Object.entries(UTM)) {
      parsed.searchParams.set(key, value)
    }
    return parsed.toString()
  } catch {
    return null
  }
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

/** Resolves the credit's destination: website first, then WhatsApp, then none. */
export function developerCreditHref(
  credit: typeof developerCredit = developerCredit,
): string | null {
  return (
    websiteCreditLink(credit.website) ??
    whatsappEnquiryLink(credit.whatsapp, credit.enquiryMessage)
  )
}
