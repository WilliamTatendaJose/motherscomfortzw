import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/cn'

const controlClasses =
  'w-full rounded-xl border border-brand-pink-soft bg-white px-4 py-3 text-ink placeholder:text-ink-subtle focus:border-brand-teal-deep focus:outline-none'

export function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  const errorId = `${name}-error`
  const hintId = `${name}-hint`

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block font-display text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="text-brand-pink-deep" aria-hidden>
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="mb-1.5 text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm font-medium text-brand-pink-deep">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlClasses, className)} {...props} />
}

export function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClasses, 'resize-y', className)} rows={5} {...props} />
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(controlClasses, className)} {...props} />
}

/**
 * Honeypot. Hidden from sight and from assistive tech, but present in the DOM —
 * naive bots fill every field they find, and the server rejects any submission
 * where this arrives non-empty.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

export function FormMessage({ status, message }: { status: string; message: string }) {
  if (!message) return null

  return (
    <p
      role={status === 'error' ? 'alert' : 'status'}
      className={cn(
        'rounded-xl px-4 py-3 text-sm font-medium',
        status === 'error'
          ? 'bg-brand-pink-soft text-brand-pink-deep'
          : 'bg-brand-teal-soft text-brand-teal-deep',
      )}
    >
      {message}
    </p>
  )
}
