import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

import { serverEnv } from '@/lib/env'

/**
 * Sanity webhook → cache invalidation.
 *
 * Set this up in Sanity: Manage → API → Webhooks, pointing at
 * `https://<site>/api/revalidate`, with the same secret as
 * SANITY_REVALIDATE_SECRET and a projection that includes `_type`.
 *
 * The signature is verified before anything is revalidated, so this endpoint
 * cannot be used by a third party to churn the cache.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv('SANITY_REVALIDATE_SECRET')

  if (!secret) {
    console.error('[revalidate] SANITY_REVALIDATE_SECRET is not set')
    return NextResponse.json({ ok: false, message: 'Not configured' }, { status: 503 })
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret)

    if (!isValidSignature) {
      return NextResponse.json({ ok: false, message: 'Invalid signature' }, { status: 401 })
    }

    if (!body?._type) {
      return NextResponse.json({ ok: false, message: 'Missing _type' }, { status: 400 })
    }

    // Next 16 requires a cache profile. 'max' purges the tag outright, which is
    // what a publish from the Studio should do.
    revalidateTag(body._type, 'max')

    return NextResponse.json({ ok: true, revalidated: body._type, now: Date.now() })
  } catch (error) {
    console.error('[revalidate] failed', error)
    return NextResponse.json({ ok: false, message: 'Revalidation failed' }, { status: 500 })
  }
}
