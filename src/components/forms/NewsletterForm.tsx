'use client'

import { Honeypot } from '@/components/forms/Field'
import { useFormSubmit } from '@/components/forms/useFormSubmit'
import { cn } from '@/lib/cn'

export function NewsletterForm({ className }: { className?: string }) {
  const { status, message, errors, submit } = useFormSubmit(
    '/api/forms/newsletter',
    "Thank you — you're on the list.",
  )

  return (
    <form onSubmit={submit} className={cn('relative', className)} noValidate>
      <Honeypot />
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          className="min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-full bg-white px-5 py-2.5 font-display text-sm font-semibold text-brand-teal-deep transition-colors hover:bg-brand-pink-soft disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Sign up'}
        </button>
      </div>
      {(message || errors.email) && (
        <p
          role={status === 'error' ? 'alert' : 'status'}
          className={cn('mt-2 text-sm', status === 'error' ? 'text-white' : 'text-white/90')}
        >
          {errors.email ?? message}
        </p>
      )}
    </form>
  )
}
