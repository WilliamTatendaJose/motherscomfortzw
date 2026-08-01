import 'server-only'

import { Resend } from 'resend'

import { serverEnv } from '@/lib/env'

const apiKey = serverEnv('RESEND_API_KEY')
const from = serverEnv('EMAIL_FROM') || "Mother's Comfort <noreply@motherscomfort.co.zw>"
const notifyTo = serverEnv('CONTACT_NOTIFY_EMAIL') || 'info@motherscomfort.co.zw'

const resend = apiKey ? new Resend(apiKey) : null

/** Escapes user-supplied values before they go into an HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Sends a notification to the charity. Returns false rather than throwing —
 * a failed notification must not lose the visitor's message, which is why the
 * submission is written to Sanity first.
 */
export async function sendNotification({
  subject,
  fields,
  replyTo,
}: {
  subject: string
  fields: Record<string, string>
  replyTo?: string
}): Promise<boolean> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — notification not sent:', subject)
    return false
  }

  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#5b5b70">${escapeHtml(key)}</td>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  try {
    const { error } = await resend.emails.send({
      from,
      to: notifyTo,
      subject,
      replyTo,
      html: `<div style="font-family:system-ui,sans-serif;color:#2b2b3d">
        <h2 style="font-size:18px">${escapeHtml(subject)}</h2>
        <table style="border-collapse:collapse;font-size:14px">${rows}</table>
      </div>`,
    })

    if (error) {
      console.error('[email] Resend rejected the message', error)
      return false
    }
    return true
  } catch (error) {
    console.error('[email] failed to send', error)
    return false
  }
}
