import { NextResponse } from 'next/server'

import { sendNotification } from '@/lib/email'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { persist } from '@/lib/sanity/writeClient'
import { fieldErrors, formSchemas, type FormType } from '@/lib/validation'

const SUCCESS_MESSAGES: Record<FormType, string> = {
  contact: 'Thank you for getting in touch. We will reply as soon as we can.',
  volunteer: 'Thank you for offering to help. We will be in touch soon.',
  newsletter: "Thank you — you're on the list.",
}

const SUBJECTS: Record<FormType, string> = {
  contact: 'New contact form message',
  volunteer: 'New volunteer / partnership enquiry',
  newsletter: 'New newsletter signup',
}

function isFormType(value: string): value is FormType {
  return value in formSchemas
}

export async function POST(request: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params

  if (!isFormType(type)) {
    return NextResponse.json({ ok: false, message: 'Unknown form.' }, { status: 404 })
  }

  const { allowed, retryAfterSeconds } = rateLimit(`form:${type}:${clientIp(request)}`, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: 'Too many submissions. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 })
  }

  const parsed = formSchemas[type].safeParse(body)

  if (!parsed.success) {
    const errors = fieldErrors(parsed.error)

    // A filled honeypot is a bot. Return the success shape so it learns nothing,
    // but do no work.
    if (errors.website) {
      return NextResponse.json({ ok: true, message: SUCCESS_MESSAGES[type] })
    }

    return NextResponse.json(
      { ok: false, message: 'Please check the highlighted fields.', errors },
      { status: 400 },
    )
  }

  const { website: _honeypot, ...data } = parsed.data as Record<string, unknown> & {
    website?: string
  }

  const fields = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, String(value ?? '')]),
  )

  // Store first, notify second: if email delivery fails the message still exists.
  await persist({
    _type: 'submission',
    formType: type,
    submittedAt: new Date().toISOString(),
    ...data,
  })

  // Reply-to only when there is an address; many enquirers leave only a phone
  // number, and an empty reply-to makes some providers reject the message.
  const email = typeof data.email === 'string' ? data.email.trim() : ''

  await sendNotification({
    subject: SUBJECTS[type],
    fields,
    replyTo: email || undefined,
  })

  return NextResponse.json({ ok: true, message: SUCCESS_MESSAGES[type] })
}
