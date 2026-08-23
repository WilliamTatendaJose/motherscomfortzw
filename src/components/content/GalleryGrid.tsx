'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon } from '@/components/icons'
import type { GalleryPhoto } from '@/lib/content/types'
import { imageUrl } from '@/lib/sanity/image'

/**
 * Photo grid with a lightbox. The grid itself is plain markup — only the
 * lightbox needs state, so this is the one client component on an otherwise
 * server-rendered page.
 */
export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    const trigger = openIndex !== null ? triggerRefs.current[openIndex] : null
    setOpenIndex(null)
    // Return focus to the thumbnail that opened the lightbox, rather than
    // dropping it back to <body> — the same reason the mobile drawer does this.
    trigger?.focus()
  }

  const show = (index: number) => setOpenIndex(((index % photos.length) + photos.length) % photos.length)

  useEffect(() => {
    if (openIndex === null) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') show(openIndex + 1)
      if (event.key === 'ArrowLeft') show(openIndex - 1)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close()/show() close over openIndex intentionally
  }, [openIndex])

  const active = openIndex !== null ? photos[openIndex] : null
  const activeSrc = active ? imageUrl(active.image, { width: 1600 }) : null

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => {
          const thumbSrc = imageUrl(photo.image, { width: 600 })
          if (!thumbSrc) return null

          return (
            <li key={photo._id}>
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[index] = el
                }}
                onClick={() => setOpenIndex(index)}
                className="group relative block aspect-square w-full overflow-hidden rounded-card bg-brand-teal-soft"
              >
                <Image
                  src={thumbSrc}
                  alt={photo.image.alt}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/30 group-hover:opacity-100">
                  <ExpandIcon className="h-6 w-6 text-white" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {active && activeSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || 'Photo'}
          className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 md:p-8"
        >
          <div className="flex items-center justify-between">
            {photos.length > 1 && (
              <span className="font-display text-sm font-semibold text-white/70">
                {openIndex! + 1} / {photos.length}
              </span>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              className="ml-auto rounded-full p-2 text-white hover:bg-white/10"
            >
              <CloseIcon className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden py-4">
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => show(openIndex! - 1)}
                className="hidden shrink-0 rounded-full p-3 text-white hover:bg-white/10 sm:block"
              >
                <ArrowLeftIcon className="h-6 w-6" />
                <span className="sr-only">Previous photo</span>
              </button>
            )}

            <div className="relative h-full w-full max-w-4xl">
              <Image
                src={activeSrc}
                alt={active.image.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => show(openIndex! + 1)}
                className="hidden shrink-0 rounded-full p-3 text-white hover:bg-white/10 sm:block"
              >
                <ArrowRightIcon className="h-6 w-6" />
                <span className="sr-only">Next photo</span>
              </button>
            )}
          </div>

          {active.caption && (
            <p className="text-center text-sm text-white/85">{active.caption}</p>
          )}

          {/* Mobile prev/next: the side buttons are hidden below sm to leave
              room for the photo, so touch users get bottom controls instead. */}
          {photos.length > 1 && (
            <div className="mt-4 flex justify-center gap-4 sm:hidden">
              <button
                type="button"
                onClick={() => show(openIndex! - 1)}
                className="rounded-full border border-white/30 p-3 text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="sr-only">Previous photo</span>
              </button>
              <button
                type="button"
                onClick={() => show(openIndex! + 1)}
                className="rounded-full border border-white/30 p-3 text-white"
              >
                <ArrowRightIcon className="h-5 w-5" />
                <span className="sr-only">Next photo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
