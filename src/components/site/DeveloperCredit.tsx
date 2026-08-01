import { developerCredit, developerCreditHref } from '@/content/credit'

/**
 * "Website by Techrehub" in the footer bottom bar.
 *
 * Links to the developer's website when one is configured, falling back to
 * WhatsApp, and rendering as plain text if neither is — so a half-configured
 * credit cannot ship as a dead link.
 *
 * The anchor text is the plain brand name. Nothing here is hidden from users or
 * search engines — no off-screen text, no cloaked links, no keyword-stuffed
 * anchor — since that would put the charity's own search ranking at risk for
 * the sake of a credit line.
 *
 * The link is `rel="noopener"` but deliberately not `noreferrer`, unlike the
 * site's other external links. `noopener` is what prevents tabnabbing;
 * `noreferrer` additionally strips the Referer header, which would cost the
 * developer referral attribution if the UTM tags were ever stripped in transit.
 * The referrer here is only a public page URL.
 */
export function DeveloperCredit() {
  const { name } = developerCredit
  const href = developerCreditHref()

  return (
    <p className="text-white/80">
      Website by{' '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
        >
          {name}
        </a>
      ) : (
        <span className="font-medium text-white">{name}</span>
      )}
    </p>
  )
}
