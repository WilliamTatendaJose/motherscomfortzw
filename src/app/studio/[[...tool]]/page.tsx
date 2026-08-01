import type { Metadata, Viewport } from 'next'
import { NextStudio } from 'next-sanity/studio'

import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}

export type { Metadata, Viewport }
