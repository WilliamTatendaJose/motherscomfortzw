import { defineField, defineType } from 'sanity'

/**
 * A mother's story. These are real, sensitive personal accounts, so the schema
 * makes two things deliberate rather than incidental:
 *
 *  - `consentConfirmed` is required. A story cannot be published without an
 *    editor affirming that written consent is on file.
 *  - `publishAnonymously` suppresses the name *and* the portrait on the site
 *    (see src/lib/content/story.ts), so a portrait uploaded before a mother
 *    changed her mind is never shown.
 */
export const story = defineType({
  name: 'story',
  title: "Mother's story",
  type: 'document',
  groups: [
    { name: 'content', title: 'Story', default: true },
    { name: 'consent', title: 'Consent' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'A short line drawn from her story, not a summary of it.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'motherName',
      title: 'Name',
      type: 'string',
      group: 'content',
      description: 'Hidden on the site if "Publish anonymously" is turned on.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'content',
      description: 'Only for team members, e.g. "Founder of Mother\'s Comfort". Usually blank.',
    }),
    defineField({
      name: 'portrait',
      title: 'Photograph',
      type: 'imageWithAlt',
      group: 'content',
      description: 'Not shown if "Publish anonymously" is turned on.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Pull quote',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on cards and at the top of her story.',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'body',
      title: 'Her story',
      type: 'blockContent',
      group: 'content',
    }),

    defineField({
      name: 'publishAnonymously',
      title: 'Publish anonymously',
      type: 'boolean',
      group: 'consent',
      initialValue: false,
      description: 'Replaces her name with "Anonymous" and hides her photograph everywhere.',
    }),
    defineField({
      name: 'consentConfirmed',
      title: 'Consent is on file',
      type: 'boolean',
      group: 'consent',
      initialValue: false,
      description:
        'Confirm that this mother has given written consent for her story, and any photograph of her, to be published on the website.',
      validation: (rule) =>
        rule.custom((value) =>
          value === true ? true : 'A story cannot be published without confirmed consent.',
        ),
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published on',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'isFounderStory',
      title: "This is the founder's story",
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Pins it to the top of the stories page and links it from the About page.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      name: 'motherName',
      anonymous: 'publishAnonymously',
      media: 'portrait',
    },
    prepare({ title, name, anonymous, media }) {
      return {
        title,
        subtitle: anonymous ? 'Anonymous' : name,
        media: anonymous ? undefined : media,
      }
    },
  },
})
