import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * `onDark` / `outlineOnDark` exist because passing colour utilities through
 * `className` does not reliably override a variant — both classes end up in the
 * list and the cascade, not the attribute order, decides. Use a variant.
 */
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'onDark' | 'outlineOnDark'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  // brand-pink-deep, not brand-pink: white-on-#EC008C is only 4.27:1 and fails AA.
  primary: 'bg-brand-pink-deep text-white hover:bg-brand-pink focus-visible:bg-brand-pink-deep',
  secondary: 'bg-brand-teal-deep text-white hover:bg-brand-teal',
  outline:
    'border-2 border-brand-pink-deep text-brand-pink-deep bg-transparent hover:bg-brand-pink-soft',
  ghost: 'text-brand-pink-deep hover:bg-brand-pink-soft',
  onDark: 'bg-white text-brand-pink-deep hover:bg-brand-pink-soft',
  outlineOnDark: 'border-2 border-white bg-transparent text-white hover:bg-white/15',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

/**
 * Note `whitespace-nowrap`: these are pill buttons, and a wrapped label breaks
 * the shape. Also note that overriding `display` or colour through `className`
 * does not reliably win — two utilities for the same property land on one
 * element and the cascade decides. Add a variant, or wrap the button.
 */
const baseClasses =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60'

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(baseClasses, variants[variant], sizes[size], className)
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={classesFor(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={classesFor(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}
