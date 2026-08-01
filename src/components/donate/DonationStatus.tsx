'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { AlertIcon, CheckIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/Button'

type State = 'pending' | 'paid' | 'failed' | 'unknown'

type StatusResponse = {
  ok: boolean
  state: State
  amount?: number | null
  tierLabel?: string | null
}

/** Back off as we go: quick at first, then slower, giving up after ~2 minutes. */
const POLL_DELAYS_MS = [2000, 2000, 3000, 3000, 5000, 5000, 8000, 8000, 10000, 10000, 15000, 15000]

export function DonationStatus({ reference }: { reference: string }) {
  const [state, setState] = useState<State>('pending')
  const [amount, setAmount] = useState<number | null>(null)
  const [exhausted, setExhausted] = useState(false)
  const attempt = useRef(0)

  useEffect(() => {
    if (!reference) {
      setState('unknown')
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout>

    async function check() {
      try {
        const response = await fetch(
          `/api/donate/status?reference=${encodeURIComponent(reference)}`,
          { cache: 'no-store' },
        )
        const result = (await response.json()) as StatusResponse

        if (cancelled) return

        if (result.ok) {
          setState(result.state)
          if (typeof result.amount === 'number') setAmount(result.amount)

          // Terminal — stop polling.
          if (result.state === 'paid' || result.state === 'failed') return
        }
      } catch {
        // Network blip: fall through and retry on the next tick.
      }

      if (cancelled) return

      const delay = POLL_DELAYS_MS[attempt.current]
      if (delay === undefined) {
        setExhausted(true)
        return
      }
      attempt.current += 1
      timer = setTimeout(check, delay)
    }

    check()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [reference])

  if (state === 'paid') {
    return (
      <Panel
        tone="success"
        title="Thank you for your support"
        body={
          amount
            ? `We've received your $${amount.toFixed(2)} donation. It goes straight to work supporting mothers who need it.`
            : "We've received your donation. It goes straight to work supporting mothers who need it."
        }
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/stories">Read the mothers&rsquo; stories</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          Your reference is <span className="font-mono">{reference}</span>
        </p>
      </Panel>
    )
  }

  if (state === 'failed') {
    return (
      <Panel
        tone="warning"
        title="That payment didn't go through"
        body="Nothing has been charged. You're welcome to try again, or get in touch and we'll help you find another way to give."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/donate#give">Try again</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Contact us
          </ButtonLink>
        </div>
      </Panel>
    )
  }

  if (state === 'unknown' || exhausted) {
    return (
      <Panel
        tone="warning"
        title="We couldn't confirm this donation yet"
        body="Payments sometimes take a few minutes to settle. If money has left your account, it has almost certainly reached us — please get in touch with your reference and we'll confirm."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact">Contact us</ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back to home
          </ButtonLink>
        </div>
        {reference && (
          <p className="mt-6 text-sm text-ink-muted">
            Your reference is <span className="font-mono">{reference}</span>
          </p>
        )}
      </Panel>
    )
  }

  return (
    <Panel
      tone="pending"
      title="Confirming your donation…"
      body="This usually takes a few seconds. If you're paying by mobile money, approve the prompt on your phone."
    >
      <p className="mt-6 text-sm text-ink-muted">
        You can safely leave this page — we&rsquo;ll still receive your donation. Reference{' '}
        <span className="font-mono">{reference}</span>.
      </p>
      <Link href="/" className="mt-4 inline-block text-brand-pink-deep hover:underline">
        Back to home
      </Link>
    </Panel>
  )
}

function Panel({
  tone,
  title,
  body,
  children,
}: {
  tone: 'success' | 'warning' | 'pending'
  title: string
  body: string
  children?: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-card bg-white p-8 text-center shadow-soft md:p-12">
      <span
        aria-hidden
        className={
          tone === 'success'
            ? 'inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal-soft text-brand-teal-deep'
            : tone === 'warning'
              ? 'inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep'
              : 'inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-soft'
        }
      >
        {tone === 'success' ? (
          <CheckIcon className="h-8 w-8" />
        ) : tone === 'warning' ? (
          <AlertIcon className="h-8 w-8" />
        ) : (
          <span className="h-6 w-6 animate-spin rounded-full border-3 border-brand-pink-deep border-t-transparent" />
        )}
      </span>
      <h1 className="mt-6 text-3xl">{title}</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">{body}</p>
      {children}
    </div>
  )
}
