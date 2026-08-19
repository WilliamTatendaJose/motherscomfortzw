import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon, ProgrammeGlyph } from '@/components/icons'
import type { Programme } from '@/lib/content/types'
import { imageUrl } from '@/lib/sanity/image'

export function ProgrammeCard({ programme }: { programme: Programme }) {
  const imageSrc = imageUrl(programme.image, { width: 900 })

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-teal-soft">
        {programme.image && imageSrc ? (
          <Image
            src={imageSrc}
            alt={programme.image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-pink-soft via-white to-brand-teal-soft text-brand-pink-deep">
            <ProgrammeGlyph icon={programme.icon} className="h-12 w-12" />
          </div>
        )}
        <span className="absolute top-5 left-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-brand-pink-deep shadow-soft">
          <ProgrammeGlyph icon={programme.icon} className="h-5 w-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl">
          <Link href={`/what-we-do/${programme.slug}`} className="after:absolute after:inset-0">
            {programme.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{programme.summary}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-pink-deep">
          Learn more
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
