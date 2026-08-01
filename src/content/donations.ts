import type { DonationTier, InKindItem } from '@/lib/content/types'

/**
 * The giving ladder exactly as published on the official donation flyer.
 * These supersede the older site's $15 clothing tier and its
 * $50/$100/$200 training tiers.
 *
 * Amounts are the *only* values the donation API will accept for a tier —
 * `src/app/api/donate/initiate/route.ts` re-derives the amount server-side from
 * this list (or from Sanity) rather than trusting whatever the browser posts.
 */
export const donationTiers: DonationTier[] = [
  {
    _id: 'tier-1',
    amount: 1,
    currency: 'USD',
    label: 'Baby care basics',
    description: 'Cotton wool, surgical spirit or petroleum jelly',
    icon: 'cotton',
    kind: 'essentials',
    order: 1,
  },
  {
    _id: 'tier-5',
    amount: 5,
    currency: 'USD',
    label: 'Bath set or diapers',
    description: 'A baby bath set (bucket & bathtub), or diapers and baby wipes',
    icon: 'bath',
    kind: 'essentials',
    order: 2,
  },
  {
    _id: 'tier-10',
    amount: 10,
    currency: 'USD',
    label: 'A warm baby blanket',
    description: 'One warm blanket to keep a newborn safe',
    icon: 'blanket',
    kind: 'essentials',
    order: 3,
  },
  {
    _id: 'tier-20',
    amount: 20,
    currency: 'USD',
    label: 'A newborn clothing set',
    description: 'Romper, vest, hat, socks and tracksuit',
    icon: 'clothing',
    kind: 'essentials',
    order: 4,
  },
  {
    _id: 'tier-25',
    amount: 25,
    currency: 'USD',
    label: 'Antenatal registration',
    description: 'Registration for one expectant mother at a local polyclinic',
    icon: 'clinic',
    kind: 'essentials',
    order: 5,
  },
  {
    _id: 'tier-120',
    amount: 120,
    currency: 'USD',
    label: 'A complete maternity support package',
    description:
      'Antenatal registration and the full set of essential baby preparation items for one mother',
    icon: 'package',
    kind: 'essentials',
    order: 6,
  },
  {
    _id: 'tier-150-baking',
    amount: 150,
    currency: 'USD',
    label: 'Sponsor a mother for baking training',
    description:
      'A full baking training programme for one mother. You can also partner with us to sponsor another approved skills training programme.',
    icon: 'baking',
    kind: 'training',
    order: 7,
  },
]

/** New, unused items only — per the flyer. */
export const inKindItems: InKindItem[] = [
  { _id: 'ik-diapers', name: 'Baby diapers', accepted: true, icon: 'diapers', order: 1 },
  { _id: 'ik-wipes', name: 'Baby wipes', accepted: true, icon: 'wipes', order: 2 },
  { _id: 'ik-clothing', name: 'Baby clothing', accepted: true, icon: 'clothing', order: 3 },
  { _id: 'ik-blankets', name: 'Baby blankets', accepted: true, icon: 'blanket', order: 4 },
  { _id: 'ik-pads', name: 'Maternity pads', accepted: true, icon: 'pads', order: 5 },
  { _id: 'ik-cotton', name: 'Cotton wool', accepted: true, icon: 'cotton', order: 6 },
  { _id: 'ik-spirit', name: 'Surgical spirit', accepted: true, icon: 'spirit', order: 7 },
  { _id: 'ik-jelly', name: 'Petroleum jelly', accepted: true, icon: 'jelly', order: 8 },
  { _id: 'ik-bathtubs', name: 'Baby bathtubs', accepted: true, icon: 'bathtub', order: 9 },
  { _id: 'ik-buckets', name: '20-litre buckets', accepted: true, icon: 'bucket', order: 10 },
]

/** Bounds for the "any other amount" field, enforced server-side. */
export const CUSTOM_AMOUNT_MIN = 1
export const CUSTOM_AMOUNT_MAX = 10_000
