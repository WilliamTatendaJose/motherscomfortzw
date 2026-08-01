import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/components/icons'
import type { Story } from '@/lib/content/types'
import { imageUrl } from '@/lib/sanity/image'
import { displayName, showPortrait } from '@/lib/content/story'

export function StoryCard({ story }: { story: Story }) {
  const portrait = showPortrait(story) ? imageUrl(story.portrait, { width: 640 }) : null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-soft transition-shadow hover:shadow-lift">
      {portrait ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-pink-soft">
          <Image
            src={portrait}
            alt={story.portrait?.alt || ''}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-brand-pink-soft to-brand-teal-soft"
        >
          <span className="font-display text-5xl font-bold text-brand-pink-deep/40">
            {displayName(story).charAt(0)}
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="font-display text-sm font-semibold text-brand-teal-deep">
          {displayName(story)}
          {story.role && <span className="text-ink-subtle"> · {story.role}</span>}
        </p>
        <h3 className="mt-2 text-xl leading-snug">
          <Link href={`/stories/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-ink-muted">{story.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-pink-deep">
          Read her story
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  )
}
