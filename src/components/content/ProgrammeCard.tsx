import Link from 'next/link'

import { ArrowRightIcon, ProgrammeGlyph } from '@/components/icons'
import type { Programme } from '@/lib/content/types'

export function ProgrammeCard({ programme }: { programme: Programme }) {
  return (
    <article className="group relative flex h-full flex-col rounded-card bg-white p-7 shadow-soft transition-shadow hover:shadow-lift">
      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink-soft text-brand-pink-deep">
        <ProgrammeGlyph icon={programme.icon} className="h-7 w-7" />
      </span>
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
    </article>
  )
}
