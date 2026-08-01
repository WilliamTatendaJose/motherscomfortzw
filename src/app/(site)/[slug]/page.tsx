import type { Metadata } from 'next'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/site/PageHeader'
import { getPage, getPageSlugs } from '@/lib/content/pages'

export async function generateStaticParams() {
  const slugs = await getPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) return { title: 'Page not found' }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.intro || undefined,
  }
}

/**
 * Simple CMS-managed pages such as Privacy and Terms. Anything without a
 * matching document 404s, which also gives the site its catch-all.
 */
export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) notFound()

  return (
    <>
      <PageHeader title={page.title} intro={page.intro ?? undefined} />
      <div className="container-page py-12 md:py-16">
        <div className="prose-story mx-auto max-w-3xl">
          {page.body && page.body.length > 0 && <PortableText value={page.body} />}
        </div>
      </div>
    </>
  )
}
