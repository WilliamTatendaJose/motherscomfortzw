import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The Studio is an editing surface and the return page carries a payment
      // reference — neither belongs in a search index.
      disallow: ['/studio', '/studio/', '/donate/return', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
