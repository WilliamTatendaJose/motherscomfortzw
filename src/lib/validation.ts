import { z } from 'zod'

import { CUSTOM_AMOUNT_MIN, CUSTOM_AMOUNT_MAX } from '@/content/donations'

/**
 * Schemas shared by the client forms and the route handlers. The server always
 * re-validates: client-side checks are a courtesy to the user, never a control.
 */

/** Present-but-empty honeypot is expected; a filled one means a bot. */
const honeypot = z.string().max(0, 'Rejected').optional()

const name = z.string().trim().min(2, 'Please enter your name').max(120)
const email = z.string().trim().email('Please enter a valid email address').max(200)
const optionalPhone = z.string().trim().max(40).optional().or(z.literal(''))

export const contactSchema = z.object({
  name,
  email,
  subject: z.string().trim().min(2, 'Please enter a subject').max(200),
  message: z.string().trim().min(10, 'Please tell us a little more').max(5000),
  website: honeypot,
})

export const volunteerSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  interest: z
    .enum(['volunteering', 'partnership', 'donation-drive', 'skills-training', 'other'])
    .default('volunteering'),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  website: honeypot,
})

export const newsletterSchema = z.object({
  email,
  website: honeypot,
})

export const formSchemas = {
  contact: contactSchema,
  volunteer: volunteerSchema,
  newsletter: newsletterSchema,
} as const

export type FormType = keyof typeof formSchemas

export type ContactInput = z.infer<typeof contactSchema>
export type VolunteerInput = z.infer<typeof volunteerSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>

/**
 * Donation intake.
 *
 * `amount` is accepted from the client only so we can show a sensible error
 * early — the route handler re-derives the real charge from `tierId` or clamps
 * the custom amount before anything reaches Paynow.
 */
export const donationSchema = z
  .object({
    tierId: z.string().trim().max(120).optional().or(z.literal('')),
    amount: z.coerce
      .number()
      .positive('Please enter an amount')
      .min(CUSTOM_AMOUNT_MIN, `The minimum donation is $${CUSTOM_AMOUNT_MIN}`)
      .max(CUSTOM_AMOUNT_MAX, `For donations above $${CUSTOM_AMOUNT_MAX} please contact us`),
    name: z.string().trim().max(120).optional().or(z.literal('')),
    email,
    method: z.enum(['web', 'ecocash', 'onemoney', 'innbucks']).default('web'),
    phone: optionalPhone,
    note: z.string().trim().max(500).optional().or(z.literal('')),
    website: honeypot,
  })
  .refine((data) => data.method === 'web' || isZimbabweMobile(data.phone ?? ''), {
    message: 'Enter the mobile number to charge, e.g. 0771 234 567',
    path: ['phone'],
  })

export type DonationInput = z.infer<typeof donationSchema>

/**
 * Zimbabwean mobile numbers: 07X XXX XXXX locally, or +263 7X XXX XXXX.
 * Paynow's mobile money endpoints expect the local 07... form.
 */
export function isZimbabweMobile(value: string): boolean {
  return /^(?:0|263|\+263)7[1-8]\d{7}$/.test(value.replace(/[\s-]/g, ''))
}

/** Normalises any accepted mobile format to the local `07XXXXXXXX` form. */
export function toLocalMobile(value: string): string {
  const digits = value.replace(/[\s-]/g, '').replace(/^\+/, '')
  if (digits.startsWith('263')) return `0${digits.slice(3)}`
  return digits
}

/** Flattens a ZodError into `{ field: message }` for form rendering. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form'
    if (!result[key]) result[key] = issue.message
  }
  return result
}
