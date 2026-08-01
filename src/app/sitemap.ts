import type { MetadataRoute } from 'next'

import { getProgrammes, getStories } from '@/lib/content'
import { getPageSlugs } from '@/lib/content/pages'
import { siteUrl } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, programmes, pageSlugs] = await Promise.all([
    getStories(),
    getProgrammes(),
    getPageSlugs(),
  ])

  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/what-we-do', priority: 0.8 },
    { path: '/stories', priority: 0.9 },
    { path: '/donate', priority: 0.9 },
    { path: '/get-involved', priority: 0.7 },
    { path: '/contact', priority: 0.6 },
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      lastModified: new Date(),
      priority: route.priority,
    })),
    ...stories.map((story) => ({
      url: `${siteUrl}/stories/${story.slug}`,
      lastModified: story.publishedAt ? new Date(story.publishedAt) : new Date(),
      priority: 0.7,
    })),
    ...programmes.map((programme) => ({
      url: `${siteUrl}/what-we-do/${programme.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
    ...pageSlugs.map((slug) => ({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      priority: 0.3,
    })),
  ]
}
