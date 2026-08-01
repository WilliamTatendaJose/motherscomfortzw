import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'

import { CTABanner } from '@/components/content/CTABanner'
import { ProgrammeGlyph } from '@/components/icons'
import { getProgramme, getProgrammeBody, getProgrammes } from '@/lib/content'
import { imageUrl } from '@/lib/sanity/image'

export async function generateStaticParams() {
  const programmes = await getProgrammes()
  return programmes.map((programme) => ({ slug: programme.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const programme = await getProgramme(slug)

  if (!programme) return { title: 'Programme not found' }

  return { title: programme.title, description: programme.summary }
}

export default async function ProgrammePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const programme = await getProgramme(slug)

  if (!programme) notFound()

  const image = imageUrl(programme.image, { width: 1200 })
  const paragraphs = getProgrammeBody(slug)

  return (
    <>
      <div className="border-b border-brand-pink-soft bg-brand-pink-tint">
        <div className="container-page py-14 md:py-20">
          <div className="max-w-3xl">
            <Link
              href="/what-we-do"
              className="font-display text-sm font-semibold text-brand-pink-deep hover:underline"
            >
              ← All programmes
            </Link>
            <span className="mt-6 mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-pink-deep">
              <ProgrammeGlyph icon={programme.icon} className="h-8 w-8" />
            </span>
            <h1 className="text-4xl leading-tight md:text-5xl">{programme.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{programme.summary}</p>
          </div>
        </div>
      </div>

      <div className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {image && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-card">
              <Image
                src={image}
                alt={programme.image?.alt || ''}
                fill
                priority
                sizes="(min-width: 768px) 48rem, 90vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="prose-story">
            {programme.body && programme.body.length > 0 ? (
              <PortableText value={programme.body} />
            ) : (
              paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)
            )}
          </div>
        </div>
      </div>

      <CTABanner
        heading="Help us reach more mothers"
        body="Every dollar makes a difference."
      />
    </>
  )
}
