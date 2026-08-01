import { defineField, defineType } from 'sanity'

/**
 * One-of-a-kind documents. They are pinned to fixed IDs in `sanity/structure.ts`
 * so editors get a single "Site settings" entry rather than the ability to
 * create competing copies.
 */

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'Search & social' },
  ],
  fields: [
    defineField({
      name: 'organisationName',
      type: 'string',
      group: 'brand',
      initialValue: "Mother's Comfort",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      group: 'brand',
      initialValue: 'Nurturing moms to be',
    }),
    defineField({
      name: 'shortDescription',
      type: 'text',
      rows: 3,
      group: 'brand',
      description: 'Used as the default description in search results and social previews.',
    }),

    defineField({
      name: 'address',
      type: 'text',
      rows: 2,
      group: 'contact',
      description:
        'The old website published three different addresses. Please enter the correct one — it appears in the footer, on the contact page and on the donate page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      group: 'contact',
      description: 'Include the country code, e.g. +263 242 311036',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp number',
      type: 'string',
      group: 'contact',
      description:
        'International format, e.g. +263718439626. This drives the floating WhatsApp button.',
    }),
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [{ type: 'socialLink' }],
      group: 'contact',
      description: 'Leave empty to hide the social links entirely.',
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeading',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'heroSubheading',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
    }),
    defineField({ name: 'heroImage', type: 'imageWithAlt' }),
    defineField({ name: 'introHeading', type: 'string' }),
    defineField({
      name: 'introBody',
      title: 'Introduction paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
    }),
    defineField({ name: 'ctaHeading', title: 'Closing banner heading', type: 'string' }),
    defineField({ name: 'ctaBody', title: 'Closing banner text', type: 'text', rows: 2 }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'purpose',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'missionPoints',
      title: 'Mission',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'storyHeading', title: "Founder's story heading", type: 'string' }),
    defineField({
      name: 'storyImage',
      title: "'Our beginning' image",
      type: 'imageWithAlt',
      description:
        "Sits beside the founder's story on the About page. If you leave this empty the founder's own portrait is used instead — and if that story is set to publish anonymously, no image shows at all.",
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
})

export const donatePage = defineType({
  name: 'donatePage',
  title: 'Donate page',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Introduction', default: true },
    { name: 'cash', title: 'Cash & bank' },
    { name: 'inkind', title: 'In-kind' },
  ],
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      group: 'intro',
      initialValue: 'How to donate',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 3 }],
      group: 'intro',
    }),
    defineField({ name: 'essentialsHeading', type: 'string', group: 'intro' }),
    defineField({ name: 'essentialsIntro', type: 'string', group: 'intro' }),
    defineField({ name: 'trainingHeading', type: 'string', group: 'intro' }),
    defineField({ name: 'trainingIntro', type: 'text', rows: 3, group: 'intro' }),

    defineField({ name: 'cashHeading', type: 'string', group: 'cash' }),
    defineField({ name: 'cashBody', type: 'text', rows: 4, group: 'cash' }),
    defineField({
      name: 'bankDetails',
      title: 'Bank transfer details',
      type: 'array',
      of: [{ type: 'labelledValue' }],
      group: 'cash',
      description: 'Leave empty to hide the bank transfer panel.',
    }),

    defineField({ name: 'inKindHeading', type: 'string', group: 'inkind' }),
    defineField({ name: 'inKindBody', type: 'text', rows: 3, group: 'inkind' }),
    defineField({
      name: 'inKindWarning',
      title: 'What we cannot accept',
      type: 'text',
      rows: 2,
      group: 'inkind',
      initialValue: 'We do NOT accept loose diapers or opened packs of wipes.',
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Donate page' }) },
})

export const singletonTypes = [siteSettings, homePage, aboutPage, donatePage]

/** Names used by `structure.ts` and by the desk's "create" filter. */
export const singletonNames = singletonTypes.map((type) => type.name)
