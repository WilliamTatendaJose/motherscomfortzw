import { developerCredit, whatsappEnquiryLink } from '@/content/credit'

/**
 * "Website by Techrehub" in the footer bottom bar.
 *
 * Renders as a link only when a usable WhatsApp number is configured;
 * otherwise it is plain text, so a half-configured credit cannot ship as a
 * dead link. Nothing here is hidden from users or search engines — no
 * off-screen text, no cloaked links — since that would put the charity's own
 * search ranking at risk for the sake of a credit line.
 */
export function DeveloperCredit() {
  const { name, whatsapp, enquiryMessage } = developerCredit
  const href = whatsappEnquiryLink(whatsapp, enquiryMessage)

  return (
    <p className="text-white/80">
      Website by{' '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
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
