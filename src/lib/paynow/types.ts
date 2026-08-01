/** Express Checkout methods. `web` uses the hosted redirect page instead. */
export type PaynowMethod = 'web' | 'ecocash' | 'onemoney' | 'innbucks'

/** Statuses Paynow reports for a transaction. */
export type PaynowStatus =
  | 'Created'
  | 'Sent'
  | 'Paid'
  | 'Awaiting Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Disputed'
  | 'Refunded'
  | 'Failed'

/**
 * Paid, Awaiting Delivery and Delivered all mean the money moved — Paynow uses
 * the latter two for merchants that fulfil goods. For a donation they are all
 * simply "received".
 */
export const PAID_STATUSES: ReadonlySet<string> = new Set([
  'paid',
  'awaiting delivery',
  'delivered',
])

/** Terminal failures: stop polling and tell the donor. */
export const FAILED_STATUSES: ReadonlySet<string> = new Set([
  'cancelled',
  'failed',
  'disputed',
  'refunded',
])

export type PaynowInitiateResult =
  | {
      ok: true
      /** Hosted checkout URL. Absent for Express Checkout. */
      redirectUrl: string | null
      /** URL to poll for the transaction's status. Store this. */
      pollUrl: string
      /** Express Checkout only: what the donor should do on their handset. */
      instructions: string | null
      /** InnBucks only: deep link and authorisation code, when returned. */
      innbucks: { deepLink: string | null; authorisationCode: string | null } | null
    }
  | { ok: false; error: string }

export type PaynowStatusResult =
  | { ok: true; status: string; amount: number | null; paynowReference: string | null }
  | { ok: false; error: string }

export type PaynowPayment = {
  reference: string
  amount: number
  additionalInfo: string
  authEmail: string
  method: PaynowMethod
  /** Local 07XXXXXXXX form. Required for Express Checkout. */
  phone?: string
}
