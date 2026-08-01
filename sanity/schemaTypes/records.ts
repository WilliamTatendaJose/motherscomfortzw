import { defineField, defineType } from 'sanity'

/**
 * Records the *website* writes, not editors: donations and form submissions.
 *
 * These live in the private `donations` dataset (see
 * src/lib/sanity/writeClient.ts) and are exposed through a separate read-only
 * workspace in the Studio, so donor and enquirer personal data is never mixed
 * into the content editors browse day to day.
 *
 * Every field is read-only: these are a transaction log, and editing them in
 * the Studio would put the record out of step with what Paynow actually
 * processed.
 */

const readOnly = { readOnly: true } as const

export const donation = defineType({
  name: 'donation',
  title: 'Donation',
  type: 'document',
  ...readOnly,
  fields: [
    defineField({ name: 'reference', title: 'Our reference', type: 'string', ...readOnly }),
    defineField({ name: 'status', type: 'string', ...readOnly }),
    defineField({ name: 'amount', title: 'Amount (USD)', type: 'number', ...readOnly }),
    defineField({ name: 'currency', type: 'string', ...readOnly }),
    defineField({ name: 'tierLabel', title: 'Tier', type: 'string', ...readOnly }),
    defineField({ name: 'tierId', type: 'string', ...readOnly, hidden: true }),
    defineField({ name: 'donorName', title: 'Donor name', type: 'string', ...readOnly }),
    defineField({ name: 'donorEmail', title: 'Donor email', type: 'string', ...readOnly }),
    defineField({ name: 'method', title: 'Payment method', type: 'string', ...readOnly }),
    defineField({ name: 'phone', type: 'string', ...readOnly }),
    defineField({ name: 'note', type: 'text', rows: 2, ...readOnly }),
    defineField({ name: 'paynowReference', title: 'Paynow reference', type: 'string', ...readOnly }),
    defineField({ name: 'pollUrl', type: 'url', ...readOnly, hidden: true }),
    defineField({ name: 'createdAt', title: 'Started at', type: 'datetime', ...readOnly }),
    defineField({ name: 'paidAt', title: 'Paid at', type: 'datetime', ...readOnly }),
  ],
  orderings: [
    { title: 'Newest first', name: 'createdAtDesc', by: [{ field: 'createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: {
      amount: 'amount',
      status: 'status',
      email: 'donorEmail',
      createdAt: 'createdAt',
    },
    prepare: ({ amount, status, email, createdAt }) => ({
      title: `$${amount ?? '?'} — ${status ?? 'Unknown'}`,
      subtitle: [email, createdAt ? new Date(createdAt).toLocaleString('en-GB') : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const submission = defineType({
  name: 'submission',
  title: 'Form submission',
  type: 'document',
  ...readOnly,
  fields: [
    defineField({ name: 'formType', title: 'Form', type: 'string', ...readOnly }),
    defineField({ name: 'name', type: 'string', ...readOnly }),
    defineField({ name: 'email', type: 'string', ...readOnly }),
    defineField({ name: 'phone', type: 'string', ...readOnly }),
    defineField({ name: 'subject', type: 'string', ...readOnly }),
    defineField({ name: 'interest', type: 'string', ...readOnly }),
    defineField({ name: 'message', type: 'text', rows: 5, ...readOnly }),
    defineField({ name: 'submittedAt', type: 'datetime', ...readOnly }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      formType: 'formType',
      name: 'name',
      email: 'email',
      subject: 'subject',
      submittedAt: 'submittedAt',
    },
    prepare: ({ formType, name, email, subject, submittedAt }) => ({
      title: subject || name || email || 'Submission',
      subtitle: [formType, submittedAt ? new Date(submittedAt).toLocaleString('en-GB') : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const recordTypes = [donation, submission]
