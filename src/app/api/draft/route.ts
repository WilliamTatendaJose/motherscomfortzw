import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { sanityClient } from '@/lib/sanity/client'
import { serverEnv } from '@/lib/env'

/**
 * Enables Next's draft mode so editors can preview unpublished changes from the
 * Studio's Presentation tool. Requires SANITY_API_READ_TOKEN — the token is
 * validated by next-sanity, so an unauthenticated caller cannot turn draft mode
 * on for themselves.
 */
export const { GET } = defineEnableDraftMode({
  client: sanityClient
    ? sanityClient.withConfig({ token: serverEnv('SANITY_API_READ_TOKEN') })
    : // Never reached in practice: without a project there is nothing to preview.
      (undefined as never),
})
