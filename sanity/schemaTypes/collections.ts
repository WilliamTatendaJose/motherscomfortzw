import { defineField, defineType } from 'sanity'

const orderField = defineField({
  name: 'order',
  title: 'Display order',
  type: 'number',
  description: 'Lower numbers appear first.',
  initialValue: 100,
})

export const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences, shown on cards.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({ name: 'body', title: 'Full description', type: 'blockContent' }),
    defineField({
      name: 'icon',
      type: 'string',
      options: {
        list: [
          { title: 'Stethoscope (antenatal care)', value: 'stethoscope' },
          { title: 'Heart (counselling)', value: 'heart' },
          { title: 'Sparkles (empowerment)', value: 'sparkles' },
          { title: 'Book (education)', value: 'book' },
          { title: 'Basket (essentials)', value: 'basket' },
        ],
      },
      initialValue: 'heart',
    }),
    defineField({ name: 'image', type: 'imageWithAlt' }),
    orderField,
  ],
  preview: { select: { title: 'title', subtitle: 'summary', media: 'image' } },
})

export const donationTier = defineType({
  name: 'donationTier',
  title: 'Donation tier',
  type: 'document',
  description: 'The giving ladder shown on the donate page.',
  fields: [
    defineField({
      name: 'amount',
      title: 'Amount (USD)',
      type: 'number',
      description:
        'This is the amount that will actually be charged when a donor picks this tier.',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'currency',
      type: 'string',
      options: { list: ['USD'] },
      initialValue: 'USD',
      readOnly: true,
      description: 'Paynow issues separate credentials per currency; only USD is wired up today.',
    }),
    defineField({
      name: 'label',
      title: 'Short label',
      type: 'string',
      description: 'e.g. "A warm baby blanket"',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'What it buys',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Baby essentials & care', value: 'essentials' },
          { title: 'Skills training sponsorship', value: 'training' },
        ],
        layout: 'radio',
      },
      initialValue: 'essentials',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      type: 'string',
      options: {
        list: ['cotton', 'bath', 'blanket', 'clothing', 'clinic', 'package', 'baking'],
      },
      initialValue: 'package',
    }),
    orderField,
  ],
  orderings: [{ title: 'Amount', name: 'amountAsc', by: [{ field: 'amount', direction: 'asc' }] }],
  preview: {
    select: { amount: 'amount', label: 'label', kind: 'kind' },
    prepare: ({ amount, label, kind }) => ({
      title: `$${amount} — ${label}`,
      subtitle: kind === 'training' ? 'Skills training' : 'Baby essentials',
    }),
  },
})

export const inKindItem = defineType({
  name: 'inKindItem',
  title: 'In-kind item',
  type: 'document',
  description: 'Goods the charity accepts as donations.',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'accepted',
      title: 'We accept this',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to remove it from the accepted list without deleting it.',
    }),
    defineField({
      name: 'icon',
      type: 'string',
      options: {
        list: [
          'diapers',
          'wipes',
          'clothing',
          'blanket',
          'pads',
          'cotton',
          'spirit',
          'jelly',
          'bathtub',
          'bucket',
        ],
      },
      initialValue: 'diapers',
    }),
    orderField,
  ],
  preview: {
    select: { title: 'name', accepted: 'accepted' },
    prepare: ({ title, accepted }) => ({
      title,
      subtitle: accepted ? 'Accepted' : 'Not accepted',
    }),
  },
})

export const impactStat = defineType({
  name: 'impactStat',
  title: 'Impact context statistic',
  type: 'document',
  description:
    'A wider maternal-health statistic that explains why the charity’s work matters. These appear on the Impact page and homepage.',
  fields: [
    defineField({
      name: 'value',
      title: 'Headline figure',
      type: 'string',
      description: 'The big number, e.g. "1 in 5" or "$25".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'What the figure means',
      type: 'text',
      rows: 2,
      description: 'What the number means.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source or citation',
      type: 'string',
      description: 'Where the figure comes from. Please cite statistics.',
    }),
    orderField,
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})

export const impactMetric = defineType({
  name: 'impactMetric',
  title: 'Actual impact result',
  type: 'document',
  description:
    "Mother's Comfort's own achievements to date, shown on the Impact page — for example, \"50 mothers supported\". Keep these separate from Impact context statistics, which cite wider research.",
  fields: [
    defineField({
      name: 'value',
      title: 'Result number',
      type: 'string',
      description: 'The headline number, e.g. "50" or "25".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'What was achieved',
      type: 'string',
      description: 'What was achieved, e.g. "mothers supported with antenatal registration fees".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Supporting detail',
      type: 'text',
      rows: 3,
      description: 'A sentence or two of detail shown under the headline.',
    }),
    orderField,
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})

export const involvementWay = defineType({
  name: 'involvementWay',
  title: 'Way to get involved',
  type: 'document',
  description: 'One card in the "There is more than one way to help" grid on the Get involved page.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'body',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  preview: { select: { title: 'title', subtitle: 'body' } },
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      description: 'Events in the past are automatically hidden from the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'image', type: 'imageWithAlt' }),
  ],
  orderings: [
    { title: 'Soonest first', name: 'startsAtAsc', by: [{ field: 'startsAt', direction: 'asc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'startsAt', media: 'image' } },
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'role', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'bio', type: 'text', rows: 3 }),
    defineField({ name: 'photo', type: 'imageWithAlt' }),
    orderField,
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'answer',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    orderField,
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  description: 'Simple pages such as Privacy or Terms.',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})

export const collectionTypes = [
  programme,
  donationTier,
  inKindItem,
  impactStat,
  impactMetric,
  involvementWay,
  event,
  teamMember,
  faq,
  page,
]
