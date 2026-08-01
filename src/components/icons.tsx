import type { SVGProps } from 'react'

import type { DonationIcon, InKindIcon, ProgrammeIcon } from '@/lib/content/types'

/**
 * Inline icon set, replacing the old Flaticon webfont (a ~200KB render-blocking
 * font for a handful of glyphs). All icons are decorative and inherit
 * `currentColor`; meaning is always carried by adjacent text.
 */

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
})

export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20.5s-7.5-4.7-7.5-9.8A4.2 4.2 0 0 1 12 7.9a4.2 4.2 0 0 1 7.5 2.8c0 5.1-7.5 9.8-7.5 9.8Z" />
  </svg>
)

export const StethoscopeIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 3v5a4 4 0 0 0 8 0V3" />
    <path d="M9 12v2a5 5 0 0 0 10 0v-1" />
    <circle cx="19" cy="10" r="2" />
  </svg>
)

export const SparklesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
    <path d="M18 15l.9 2.3 2.3.9-2.3.9L18 21l-.9-2.3-2.3-.9 2.3-.9L18 15Z" />
  </svg>
)

export const BookIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z" />
  </svg>
)

export const BasketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 9h18l-1.6 9.2A2 2 0 0 1 17.4 20H6.6a2 2 0 0 1-2-1.8L3 9Z" />
    <path d="M8 9 10 4M16 9l-2-5" />
  </svg>
)

export const CottonIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4a3 3 0 0 1 2.8 1.9A3 3 0 0 1 18 9a3 3 0 0 1-1.5 2.6A3 3 0 0 1 12 15a3 3 0 0 1-4.5-3.4A3 3 0 0 1 6 9a3 3 0 0 1 3.2-3.1A3 3 0 0 1 12 4Z" />
    <path d="M12 15v5" />
  </svg>
)

export const BathIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2Z" />
    <path d="M7 11V6a2 2 0 0 1 4 0" />
    <path d="M6 20l-1 1M18 20l1 1" />
  </svg>
)

export const BlanketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="6" width="18" height="5" rx="1.5" />
    <rect x="4.5" y="11" width="15" height="4.5" rx="1.5" />
    <rect x="6" y="15.5" width="12" height="4" rx="1.5" />
  </svg>
)

export const ClothingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 3.5 12 6l3-2.5 4 2.2-1.6 3.6-1.4-.5V20H8V8.8l-1.4.5L5 5.7l4-2.2Z" />
  </svg>
)

export const ClinicIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="7" width="16" height="13" rx="2" />
    <path d="M12 10.5v5M9.5 13h5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

export const PackageIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="8" width="18" height="12" rx="1.5" />
    <path d="M3 12h18M12 8v12" />
    <path d="M8.5 8a2.5 2.5 0 0 1 0-5C10.5 3 12 8 12 8s1.5-5 3.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
)

export const BakingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 16h16a0 0 0 0 1 0 0 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
    <path d="M7 12.5c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    <path d="M12 7.5V4" />
  </svg>
)

export const DiapersIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16v4a9 9 0 0 1-8 8.9A9 9 0 0 1 4 10V6Z" />
    <path d="M4 9h16" />
  </svg>
)

export const WipesIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="8" width="18" height="11" rx="2.5" />
    <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8" />
    <path d="M10 12.5h4" />
  </svg>
)

export const PadsIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="4" width="14" height="16" rx="5" />
    <path d="M9.5 9.5h5M9.5 13h5" />
  </svg>
)

export const SpiritIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 3h4v3l2.6 3.4A4 4 0 0 1 17.4 12v6a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-6a4 4 0 0 1 .8-2.6L10 6V3Z" />
    <path d="M12 12v4M10 14h4" />
  </svg>
)

export const JellyIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2" />
    <path d="M12 12v4M10 14h4" />
  </svg>
)

export const BucketIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 8h14l-1.3 10.2a2 2 0 0 1-2 1.8H8.3a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M7 8a5 5 0 0 1 10 0" />
  </svg>
)

export const WhatsAppIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.08l-.3-.18-3.08.9.9-3-.2-.3A8.1 8.1 0 0 1 12.05 3.8Zm-3.3 4.1c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.2.87 2.35.99 2.51.12.16 1.7 2.7 4.2 3.68 2.08.82 2.5.66 2.95.62.45-.04 1.45-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.77.96-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.33-.74-1.81-.19-.47-.39-.4-.54-.41h-.5Z" />
  </svg>
)

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)} strokeWidth={2.2}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
)

export const AlertIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 22 20H2L12 3.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
)

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const MailIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)

export const PhoneIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
  </svg>
)

export const PinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

const programmeIcons: Record<ProgrammeIcon, (p: IconProps) => React.ReactElement> = {
  stethoscope: StethoscopeIcon,
  heart: HeartIcon,
  sparkles: SparklesIcon,
  book: BookIcon,
  basket: BasketIcon,
}

const donationIcons: Record<DonationIcon, (p: IconProps) => React.ReactElement> = {
  cotton: CottonIcon,
  bath: BathIcon,
  blanket: BlanketIcon,
  clothing: ClothingIcon,
  clinic: ClinicIcon,
  package: PackageIcon,
  baking: BakingIcon,
}

const inKindIcons: Record<InKindIcon, (p: IconProps) => React.ReactElement> = {
  diapers: DiapersIcon,
  wipes: WipesIcon,
  clothing: ClothingIcon,
  blanket: BlanketIcon,
  pads: PadsIcon,
  cotton: CottonIcon,
  spirit: SpiritIcon,
  jelly: JellyIcon,
  bathtub: BathIcon,
  bucket: BucketIcon,
}

export function ProgrammeGlyph({ icon, ...props }: { icon: ProgrammeIcon } & IconProps) {
  const Glyph = programmeIcons[icon] ?? HeartIcon
  return <Glyph {...props} />
}

export function DonationGlyph({ icon, ...props }: { icon: DonationIcon } & IconProps) {
  const Glyph = donationIcons[icon] ?? HeartIcon
  return <Glyph {...props} />
}

export function InKindGlyph({ icon, ...props }: { icon: InKindIcon } & IconProps) {
  const Glyph = inKindIcons[icon] ?? BasketIcon
  return <Glyph {...props} />
}
