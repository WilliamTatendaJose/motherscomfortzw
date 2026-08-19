import type { ImpactMetric, ImpactStat, InvolvementWay, Programme } from '@/lib/content/types'

/** Migrated from the "Our Work" section of the previous about page. */
export const programmes: Programme[] = [
  {
    _id: 'programme-antenatal',
    title: 'Antenatal care',
    slug: 'antenatal-care',
    icon: 'stethoscope',
    order: 1,
    image: {
      url: '/images/preparation.jpg',
      alt: 'A prepared baby package of blankets, clothing and toiletries in a green tub',
    },
    summary:
      'We pay antenatal registration fees for underprivileged mothers so they can access skilled care throughout pregnancy — and we provide the baby essentials they need to prepare.',
  },
  {
    _id: 'programme-counselling',
    title: 'Counselling',
    slug: 'counselling',
    icon: 'heart',
    order: 2,
    image: {
      url: '/images/volunteer.jpg',
      alt: "Mother's Comfort team supporting a mother at a clinic",
    },
    summary:
      'A happy mother equals a happy baby. We provide counselling to underprivileged pregnant women for their wellbeing and that of their children.',
  },
  {
    _id: 'programme-empowerment',
    title: 'Economic empowerment',
    slug: 'empowerment',
    icon: 'sparkles',
    order: 3,
    image: {
      url: '/images/training.JPG',
      alt: 'Two women working at sewing machines during a tailoring training session',
    },
    summary:
      'Economically empowered women tend to have healthier and more educated families. We provide skills training in tailoring, baking, poultry, agriculture and detergent making.',
  },
]

/** Long-form copy for each programme, kept beside the summaries above. */
export const programmeBodies: Record<string, string[]> = {
  'antenatal-care': [
    'Women die because of pregnancy and childbirth complications. Most of these complications develop during pregnancy, while others exist beforehand but are worsened by it — especially if they are not managed well.',
    'All pregnant women need access to high quality care from skilled health personnel during pregnancy and after childbirth. Health care solutions to prevent or manage complications are well known, and timely management and treatment can make the difference between life and death, for the mother as well as for the baby.',
    "Mother's Comfort provides antenatal registration fees to underprivileged mothers so they can access antenatal care. We also provide baby essentials to help them prepare.",
  ],
  counselling: [
    'A happy mother equals a happy baby.',
    'Pregnancy and parenthood can be very difficult, and maternal mental health should not be ignored. Maternal counselling improves a mother’s understanding and health practices, improves the wellbeing of both mother and baby, and increases confidence in parenting.',
    "Mother's Comfort provides counselling services to underprivileged pregnant women, for their wellbeing and that of their children.",
  ],
  empowerment: [
    'Economically empowered women tend to have healthier and more educated families.',
    "Mother's Comfort provides skills training in tailoring, baking, poultry, agriculture and detergent making, so that women gain skills they can build a living from.",
  ],
}

/**
 * The "Did you know?" figures from the previous homepage carousel, with their
 * sources attributed — they were presented unsourced before.
 */
export const impactStats: ImpactStat[] = [
  {
    _id: 'stat-home-births',
    value: '1 in 5',
    label: 'births in Zimbabwe took place at home rather than in a health facility',
    source: 'Zimbabwe Demographic and Health Survey, 2017',
    order: 1,
  },
  {
    _id: 'stat-maternal-deaths',
    value: 'Every 2 minutes',
    label: 'a woman dies somewhere in the world from complications of pregnancy or childbirth',
    source: 'World Health Organization',
    order: 2,
  },
  {
    _id: 'stat-registration',
    value: '$25',
    label: 'registers one expectant mother for antenatal care at a local polyclinic',
    source: null,
    order: 3,
  },
]

/** Mother's Comfort's own achievements to date, shown on the Impact page. */
export const impactMetrics: ImpactMetric[] = [
  {
    _id: 'metric-antenatal',
    value: '50',
    label: 'mothers supported with antenatal registration fees',
    description:
      'Antenatal registration fees provided to help women access care at Hatcliffe, Budiriro 1, Mabvuku and Rutsanana Polyclinics.',
    order: 1,
  },
  {
    _id: 'metric-newborns',
    value: '50',
    label: 'newborns supported',
    description:
      'Newborn essentials provided to mothers who needed help preparing for their babies’ arrival.',
    order: 2,
  },
  {
    _id: 'metric-counselling',
    value: '8',
    label: 'counselling sessions',
    description:
      'Providing mothers with guidance, emotional support and a safe space to navigate pregnancy and motherhood.',
    order: 3,
  },
  {
    _id: 'metric-training',
    value: '25',
    label: 'women trained',
    description:
      'Practical baking and food-production skills provided to help women explore income-generating opportunities.',
    order: 4,
  },
]

/** Cards in the "There is more than one way to help" grid on Get involved. */
export const involvementWays: InvolvementWay[] = [
  {
    _id: 'way-volunteer',
    title: 'Volunteer your time',
    body: 'Help at collection drives, pack maternity packages, or lend a professional skill.',
    order: 1,
  },
  {
    _id: 'way-partner',
    title: 'Partner with us',
    body: 'Companies and churches can sponsor antenatal registrations or a skills training cohort.',
    order: 2,
  },
  {
    _id: 'way-drive',
    title: 'Run a donation drive',
    body: 'Collect new baby essentials at your workplace, school or congregation.',
    order: 3,
  },
  {
    _id: 'way-teach',
    title: 'Teach a skill',
    body: 'Train mothers in baking, tailoring, poultry, agriculture or detergent making.',
    order: 4,
  },
]
