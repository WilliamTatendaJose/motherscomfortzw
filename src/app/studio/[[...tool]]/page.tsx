import { isSanityConfigured } from '@/lib/env'

import { StudioNotConfigured } from './StudioNotConfigured'
import { Studio } from './Studio'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

/**
 * Sanity throws "Configuration must contain `projectId`" if the Studio is
 * mounted without a project. Until one exists, show setup instructions instead
 * of a 500 — the rest of the site runs fine from the fallback content, and this
 * page should say so.
 */
export default function StudioPage() {
  if (!isSanityConfigured) return <StudioNotConfigured />
  return <Studio />
}
