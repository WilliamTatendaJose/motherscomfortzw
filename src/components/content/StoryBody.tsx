import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

import type { Story } from '@/lib/content/types'
import { imageUrl } from '@/lib/sanity/image'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = imageUrl(
        { url: value?.asset?.url ?? '', alt: value?.alt ?? '' },
        { width: 1200 },
      )
      if (!url) return null

      return (
        <figure className="my-8">
          <Image
            src={url}
            alt={value.alt ?? ''}
            width={1200}
            height={800}
            className="rounded-card"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-ink-subtle">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? '#'
      const external = /^https?:\/\//.test(href)

      return external ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      )
    },
  },
}

/**
 * Renders a story body from Sanity's Portable Text, falling back to the plain
 * paragraphs held in `src/content/stories.ts` for content not yet migrated
 * into the CMS.
 */
export function StoryBody({ story }: { story: Story }) {
  if (story.body && story.body.length > 0) {
    return (
      <div className="prose-story">
        <PortableText value={story.body} components={components} />
      </div>
    )
  }

  return (
    <div className="prose-story">
      {(story.plainBody ?? []).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  )
}
