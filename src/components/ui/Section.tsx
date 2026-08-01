import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

const tones = {
  cream: 'bg-cream',
  white: 'bg-white',
  blush: 'bg-brand-pink-tint',
  teal: 'bg-brand-teal-soft',
  tealDeep: 'bg-brand-teal-deep text-white',
} as const

export function Section({
  tone = 'cream',
  className,
  children,
  id,
}: {
  tone?: keyof typeof tones
  className?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} className={cn(tones[tone], 'py-16 md:py-24', className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'center',
  inverse = false,
}: {
  eyebrow?: string
  title: string
  intro?: string | string[]
  align?: 'center' | 'left'
  inverse?: boolean
}) {
  const paragraphs = Array.isArray(intro) ? intro : intro ? [intro] : []

  return (
    <div
      className={cn(
        'mb-12 max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            'mb-3 font-display text-sm font-semibold tracking-[0.18em] uppercase',
            inverse ? 'text-white/80' : 'text-brand-pink-deep',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl leading-tight md:text-4xl',
          inverse && 'text-white',
        )}
      >
        {title}
      </h2>
      {paragraphs.map((text, i) => (
        <p
          key={i}
          className={cn(
            'mt-4 text-lg leading-relaxed',
            inverse ? 'text-white/85' : 'text-ink-muted',
          )}
        >
          {text}
        </p>
      ))}
    </div>
  )
}
