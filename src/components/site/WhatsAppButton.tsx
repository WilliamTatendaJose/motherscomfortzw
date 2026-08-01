import { WhatsAppIcon } from '@/components/icons'

export function WhatsAppButton({ number }: { number: string }) {
  const digits = number.replace(/[^\d]/g, '')
  if (!digits) return null

  const message = encodeURIComponent("Hello Mother's Comfort, I'd like to help.")

  // Uses WhatsApp's dark brand green (#075E54). The familiar lighter #128C7E
  // gives the white label only 4.14:1, which fails WCAG AA.

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#075E54] px-4 py-3 text-white shadow-lift transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden font-display text-sm font-semibold sm:inline">
        Chat on WhatsApp
      </span>
      <span className="sr-only sm:hidden">Chat with us on WhatsApp</span>
    </a>
  )
}
