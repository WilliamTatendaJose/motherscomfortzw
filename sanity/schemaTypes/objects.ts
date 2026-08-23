import { defineArrayMember, defineField, defineType } from 'sanity'

/** Rich text for stories and programme bodies. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Sub-heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for people using a screen reader.',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
  ],
})

/**
 * Image with mandatory alt text. Used everywhere instead of the bare `image`
 * type so a decorative-looking upload can't ship without a description.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description:
        'Describe what the image shows, for people using a screen reader. Leave blank only if the image is purely decorative.',
      validation: (rule) => rule.required().warning('Almost every image needs alt text.'),
    }),
  ],
})

export const seo = defineType({
  name: 'seo',
  title: 'Search & social',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page title',
      description: 'Overrides the default title in Google and social previews.',
      validation: (rule) => rule.max(60).warning('Titles over 60 characters get cut off.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Description',
      validation: (rule) => rule.max(160).warning('Descriptions over 160 characters get cut off.'),
    }),
    defineField({ name: 'image', type: 'imageWithAlt', title: 'Social sharing image' }),
  ],
})

export const labelledValue = defineType({
  name: 'labelledValue',
  title: 'Detail',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'value', type: 'string', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'value' } },
})

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: ['facebook', 'instagram', 'x', 'linkedin', 'youtube', 'tiktok'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
})

export const impactResult = defineType({
  name: 'impactResult',
  title: 'Actual impact result',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Result number',
      type: 'string',
      description: 'The headline number, for example “50” or “25”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'What was achieved',
      type: 'string',
      description: 'Describe the result, for example “mothers supported with antenatal fees”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Supporting detail',
      type: 'text',
      rows: 3,
      description: 'Optional detail shown below the result on the Impact page.',
    }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})

/**
 * One entry in the site's primary navigation — the header menu, the mobile
 * drawer, and the footer's "Explore" column all read from the same list, so
 * adding or renaming a page updates it everywhere at once instead of needing
 * two hand-edited arrays kept in sync.
 */
export const navLink = defineType({
  name: 'navLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      description: 'The text shown in the menu, e.g. "What We Do".',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'href',
      type: 'string',
      title: 'Path',
      description: 'An internal path starting with /, e.g. /what-we-do',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\//, { name: 'internal path' })
          .error('Must be an internal path starting with /, e.g. /about'),
    }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

export const objectTypes = [
  blockContent,
  imageWithAlt,
  seo,
  labelledValue,
  socialLink,
  impactResult,
  navLink,
]
