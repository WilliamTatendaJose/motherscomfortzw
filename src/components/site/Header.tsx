'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { CloseIcon, MenuIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const navigation = [
  { href: '/about', label: 'About' },
  { href: '/what-we-do', label: 'What we do' },
  { href: '/stories', label: "A mother's story" },
  { href: '/get-involved', label: 'Get involved' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ organisationName }: { organisationName: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Close the drawer on navigation, otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll and move focus into the drawer while it is open.
  useEffect(() => {
    if (!open) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-brand-pink-soft bg-white/95 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-pink-deep focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label={`${organisationName} home`}>
          <Image
            src="/logo.png"
            alt=""
            width={52}
            height={52}
            priority
            className="h-11 w-11 object-contain md:h-13 md:w-13"
          />
          <span className="font-display text-lg leading-tight font-bold text-brand-teal-deep md:text-xl">
            Mother&rsquo;s
            <br />
            Comfort
          </span>
        </Link>

        {/*
         * Breakpoint is 56rem (896px), not Tailwind's `lg` (1024px). The five
         * links plus the logo and CTA measure ~880px, so `lg` was hiding a nav
         * that fits — taking it away across the whole tablet-landscape range
         * and any non-maximised laptop window.
         */}
        <nav aria-label="Main" className="hidden items-center gap-0.5 min-[56rem]:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'rounded-full px-3 py-2 font-display text-[0.9rem] font-semibold whitespace-nowrap transition-colors',
                isActive(item.href)
                  ? 'bg-brand-pink-soft text-brand-pink-deep'
                  : 'text-ink hover:bg-brand-pink-soft hover:text-brand-pink-deep',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/*
           * The show/hide lives on a wrapper, not on ButtonLink. Passing
           * `hidden` to the button puts two display utilities on one element,
           * fighting its own `inline-flex` — the cascade decides, and the
           * button stayed visible on phones where it should collapse.
           */}
          <span className="hidden sm:block">
            <ButtonLink href="/donate" size="sm">
              Donate now
            </ButtonLink>
          </span>
          {/*
           * A bordered button with a visible "Menu" label, not a bare icon.
           * Next to the solid pink Donate pill a thin outline glyph reads as
           * decoration, which left people thinking Donate was the only nav.
           */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex items-center gap-2 rounded-full border-2 border-brand-teal-deep px-3 py-2 font-display text-sm font-semibold text-brand-teal-deep transition-colors hover:bg-brand-teal-soft min-[56rem]:hidden"
          >
            <MenuIcon className="h-5 w-5" />
            Menu
          </button>
        </div>
      </div>

      </header>

      {/*
       * The drawer is a sibling of <header>, not a child of it, and this is
       * load-bearing. The header carries `backdrop-blur-sm`, and a
       * backdrop-filter makes an element the containing block for any
       * `position: fixed` descendant — so inside the header, `inset-0`
       * resolved to the ~72px header box rather than the viewport, and the
       * drawer rendered as a sliver with the page showing through.
       */}
      {open && (
        <div className="fixed inset-0 z-50 min-[56rem]:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
          />
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute top-0 right-0 flex h-full w-[min(20rem,85vw)] flex-col bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-brand-pink-soft px-5 py-4">
              <span className="font-display font-bold text-brand-teal-deep">Menu</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-ink hover:bg-brand-pink-soft"
              >
                <CloseIcon className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            {/* Home is included here but not on desktop: in the drawer the
                logo is off-screen, so it is the only way back. */}
            <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {[{ href: '/', label: 'Home' }, ...navigation].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-xl px-4 py-3 font-display font-semibold',
                    isActive(item.href)
                      ? 'bg-brand-pink-soft text-brand-pink-deep'
                      : 'text-ink hover:bg-brand-pink-tint',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-brand-pink-soft p-4">
              <ButtonLink href="/donate" className="w-full">
                Donate now
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
