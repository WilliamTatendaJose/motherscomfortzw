import { z } from 'zod'

import { CUSTOM_AMOUNT_MIN, CUSTOM_AMOUNT_MAX } from '@/content/donations'

/**
 * Schemas shared by the client forms and the route handlers. The server always
 * re-validates: client-side checks are a courtesy to the user, never a control.
 *
 * Email is optional everywhere except the newsletter. Most donors and enquirers
 * here reach us by phone or WhatsApp and many do not use email at all, so
 * requiring an address would turn people away. Forms instead require *some*
 * way to reply — a phone number or an email, either one.
 */

/** Present-but-empty honeypot is expected; a filled one means a bot. */
const honeypot = z.string().max(0, 'Rejected').optional()

const name = z.string().trim().min(2, 'Please enter your name').max(120)

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Optional email: blank is fine, but a malformed address is not. */
const optionalEmail = z
  .string()
  .trim()
  .max(200)
  .optional()
  .refine((value) => !value || EMAIL_PATTERN.test(value), 'Please enter a valid email address')

/** Optional phone. Accepts local and international formats — diaspora donors
 *  give a foreign number, and Express Checkout is validated separately. */
const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .optional()
  .refine((value) => !value || isValidPhone(value), 'Please enter a valid phone number')

const requiredEmail = z
  .string()
  .trim()
  .min(1, 'Please enter your email address')
  .max(200)
  .refine((value) => EMAIL_PATTERN.test(value), 'Please enter a valid email address')

/** Every reply-expecting form needs at least one way to reach the sender. */
const CONTACT_REQUIRED = {
  message: 'Please give us a phone number or an email address so we can reply',
  path: ['phone'],
}

const hasSomeContact = (data: { phone?: string; email?: string }) =>
  Boolean(data.phone?.trim() || data.email?.trim())

export const contactSchema = z
  .object({
    name,
    phone: optionalPhone,
    email: optionalEmail,
    subject: z.string().trim().min(2, 'Please enter a subject').max(200),
    message: z.string().trim().min(10, 'Please tell us a little more').max(5000),
    website: honeypot,
  })
  .refine(hasSomeContact, CONTACT_REQUIRED)

export const volunteerSchema = z
  .object({
    name,
    phone: optionalPhone,
    email: optionalEmail,
    interest: z
      .enum(['volunteering', 'partnership', 'donation-drive', 'skills-training', 'other'])
      .default('volunteering'),
    message: z.string().trim().max(5000).optional().or(z.literal('')),
    website: honeypot,
  })
  .refine(hasSomeContact, CONTACT_REQUIRED)

/** The one place an email is genuinely required — it is what is being signed up. */
export const newsletterSchema = z.object({
  email: requiredEmail,
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
 *
 * Neither phone nor email is individually required, but one of them must be
 * present so the donation can be acknowledged. Express Checkout additionally
 * needs a Zimbabwean mobile, because that is the wallet being charged.
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
    phone: optionalPhone,
    email: optionalEmail,
    method: z.enum(['web', 'ecocash', 'onemoney', 'innbucks']).default('web'),
    note: z.string().trim().max(500).optional().or(z.literal('')),
    website: honeypot,
  })
  .refine((data) => data.method === 'web' || isZimbabweMobile(data.phone ?? ''), {
    message: 'Enter the mobile number to charge, e.g. 0771 234 567',
    path: ['phone'],
  })
  .refine(hasSomeContact, {
    message: 'Please give us a phone number or an email so we can thank you',
    path: ['phone'],
  })

export type DonationInput = z.infer<typeof donationSchema>

/**
 * Zimbabwean mobile numbers: 07X XXX XXXX locally, or +263 7X XXX XXXX.
 * Paynow's mobile money endpoints expect the local 07... form.
 */
export function isZimbabweMobile(value: string): boolean {
  return /^(?:0|263|\+263)7[1-8]\d{7}$/.test(value.replace(/[\s()-]/g, ''))
}

/** Loose international check — enough to catch typos without rejecting
 *  legitimate foreign numbers from diaspora donors. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s()+-]/g, '')
  return /^\d{7,15}$/.test(digits)
}

/** Normalises any accepted mobile format to the local `07XXXXXXXX` form. */
export function toLocalMobile(value: string): string {
  const digits = value.replace(/[\s()-]/g, '').replace(/^\+/, '')
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
