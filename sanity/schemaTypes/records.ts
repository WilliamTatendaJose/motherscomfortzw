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
    defineField({
      name: 'isTest',
      title: 'Test transaction',
      type: 'boolean',
      ...readOnly,
      description:
        'Stamped from PAYNOW_TEST_MODE when the donation is created. No real money moved, so these are excluded from Received and from reconciliation totals.',
    }),
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
      isTest: 'isTest',
    },
    prepare: ({ amount, status, email, createdAt, isTest }) => ({
      title: `$${amount ?? '?'} — ${status ?? 'Unknown'}${isTest ? ' (TEST)' : ''}`,
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

/**
 * Donations that arrive outside Paynow — bank transfer, cash in hand, a direct
 * EcoCash send, or goods.
 *
 * Unlike `donation` this is entered by hand, so it is deliberately *not*
 * read-only: there is no upstream system to contradict. It exists because the
 * Paynow log alone under-reports income, and reconciliation against the bank
 * statement is impossible if half the gifts were never written down.
 */
export const offlineDonation = defineType({
  name: 'offlineDonation',
  title: 'Offline donation',
  type: 'document',
  fields: [
    defineField({
      name: 'receivedAt',
      title: 'Date received',
      type: 'date',
      description: 'The date the money or goods actually reached us, not the date you record it.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'method',
      title: 'How it arrived',
      type: 'string',
      options: {
        list: [
          { title: 'Bank transfer', value: 'bank' },
          { title: 'Cash', value: 'cash' },
          { title: 'EcoCash / OneMoney (direct)', value: 'mobile' },
          { title: 'InnBucks (direct)', value: 'innbucks' },
          { title: 'Goods (in-kind)', value: 'inKind' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'bank',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount (USD)',
      type: 'number',
      description: 'Leave empty for goods with no agreed cash value.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const method = (context.document as { method?: string } | undefined)?.method
          if (method === 'inKind') return true
          if (typeof value !== 'number') return 'An amount is required unless this is a gift of goods.'
          return value > 0 || 'The amount must be greater than zero.'
        }),
    }),
    defineField({
      name: 'inKindDescription',
      title: 'What was given',
      type: 'text',
      rows: 3,
      description: 'For gifts of goods — e.g. "12 packs of newborn nappies, 6 baby blankets".',
      hidden: ({ document }) => document?.method !== 'inKind',
    }),
    defineField({
      name: 'donorName',
      title: 'Donor',
      type: 'string',
      description: 'Leave empty for an anonymous gift.',
    }),
    defineField({ name: 'donorContact', title: 'Donor phone or email', type: 'string' }),
    defineField({
      name: 'bankReference',
      title: 'Bank / transaction reference',
      type: 'string',
      description:
        'The reference as it appears on the statement. This is what makes the record reconcilable — fill it in whenever there is one.',
    }),
    defineField({
      name: 'thanked',
      title: 'Thank-you sent',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      type: 'text',
      rows: 3,
      description: 'Anything the treasurer needs to know when reconciling.',
    }),
    defineField({
      name: 'recordedBy',
      title: 'Recorded by',
      type: 'string',
      description: 'Who entered this, so queries can be taken back to a person.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'receivedAtDesc',
      by: [{ field: 'receivedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      amount: 'amount',
      method: 'method',
      donorName: 'donorName',
      receivedAt: 'receivedAt',
      inKind: 'inKindDescription',
    },
    prepare: ({ amount, method, donorName, receivedAt, inKind }) => {
      const labels: Record<string, string> = {
        bank: 'Bank transfer',
        cash: 'Cash',
        mobile: 'EcoCash / OneMoney',
        innbucks: 'InnBucks',
        inKind: 'Goods',
        other: 'Other',
      }
      return {
        title:
          method === 'inKind' && !amount
            ? inKind || 'Gift of goods'
            : `$${amount ?? '?'} — ${donorName || 'Anonymous'}`,
        subtitle: [labels[method] ?? method, receivedAt].filter(Boolean).join(' · '),
      }
    },
  },
})

export const recordTypes = [donation, offlineDonation, submission]
