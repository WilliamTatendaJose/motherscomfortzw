import 'server-only'

import type { PortableTextBlock } from '@portabletext/react'

import { sanityFetch } from '@/lib/sanity/client'

export type CmsPage = {
  title: string
  slug: string
  intro: string | null
  body: PortableTextBlock[] | null
  seo: { title?: string; description?: string } | null
}

export async function getPage(slug: string): Promise<CmsPage | null> {
  return sanityFetch<CmsPage>(
    `*[_type == "page" && slug.current == $slug][0]{
      title, "slug": slug.current, intro, body, seo{title, description}
    }`,
    { slug },
    ['page'],
  )
}

/**
 * Slugs of every CMS page. Used both for static generation and to decide
 * whether the footer should link to Privacy/Terms at all — linking to a page
 * that has not been written yet would just produce a 404.
 */
export async function getPageSlugs(): Promise<string[]> {
  const rows = await sanityFetch<{ slug: string }[]>(
    `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
    {},
    ['page'],
  )
  return rows?.map((row) => row.slug) ?? []
}
