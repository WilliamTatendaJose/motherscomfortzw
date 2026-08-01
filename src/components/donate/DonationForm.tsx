'use client'

import { useState } from 'react'

import { Field, FormMessage, Honeypot, TextInput } from '@/components/forms/Field'
import { DonationGlyph } from '@/components/icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { DonationTier } from '@/lib/content/types'

type Method = 'web' | 'ecocash' | 'onemoney' | 'innbucks'

const methods: { value: Method; label: string; hint: string }[] = [
  { value: 'web', label: 'Card or mobile money', hint: 'Choose how to pay on the Paynow page' },
  { value: 'ecocash', label: 'EcoCash', hint: 'Approve the prompt on your phone' },
  { value: 'onemoney', label: 'OneMoney', hint: 'Approve the prompt on your phone' },
  { value: 'innbucks', label: 'InnBucks', hint: 'Pay with your InnBucks code' },
]

type InitiateResponse = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
  reference?: string
  redirectUrl?: string | null
  instructions?: string | null
  innbucks?: { deepLink: string | null; authorisationCode: string | null } | null
}

export function DonationForm({ tiers }: { tiers: DonationTier[] }) {
  const [selectedTier, setSelectedTier] = useState<string | null>(tiers[2]?._id ?? null)
  const [customAmount, setCustomAmount] = useState('')
  const [method, setMethod] = useState<Method>('web')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error' | 'pending'>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState<InitiateResponse | null>(null)

  const activeTier = tiers.find((tier) => tier._id === selectedTier) ?? null
  const amount = activeTier ? activeTier.amount : Number.parseFloat(customAmount || '0')
  const isMobileMoney = method !== 'web'

  function chooseTier(id: string) {
    setSelectedTier(id)
    setCustomAmount('')
    setErrors((prev) => ({ ...prev, amount: '' }))
  }

  function chooseCustom(value: string) {
    setCustomAmount(value)
    setSelectedTier(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    setStatus('submitting')
    setErrors({})
    setMessage('')

    try {
      const response = await fetch('/api/donate/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tierId: selectedTier ?? '',
          amount: amount || 0,
          method,
        }),
      })

      const result = (await response.json()) as InitiateResponse

      if (!response.ok || !result.ok) {
        setStatus('error')
        setErrors(result.errors ?? {})
        setMessage(result.message ?? 'We could not start this payment. Please try again.')
        return
      }

      // Web flow: hand the donor to Paynow's hosted page.
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }

      // Express Checkout: the donor approves on their handset, so stay here
      // and send them to the return page to watch for confirmation.
      setStatus('pending')
      setPending(result)
    } catch {
      setStatus('error')
      setMessage('We could not reach the server. Please check your connection and try again.')
    }
  }

  if (status === 'pending' && pending) {
    return (
      <div className="rounded-card bg-white p-7 shadow-soft">
        <h3 className="text-xl">Almost there</h3>
        <p className="mt-3 text-ink-muted">
          {pending.instructions ??
            'Check your phone and approve the payment prompt to complete your donation.'}
        </p>

        {pending.innbucks?.authorisationCode && (
          <p className="mt-4 rounded-xl bg-brand-teal-soft px-4 py-3">
            <span className="text-sm text-ink-muted">Your InnBucks code</span>
            <br />
            <span className="font-display text-lg font-bold text-brand-teal-deep">
              {pending.innbucks.authorisationCode}
            </span>
          </p>
        )}

        <a
          href={`/donate/return?reference=${encodeURIComponent(pending.reference ?? '')}`}
          className="mt-6 inline-flex rounded-full bg-brand-pink-deep px-6 py-3 font-display font-semibold text-white hover:bg-brand-pink"
        >
          I&rsquo;ve approved it — check my donation
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative rounded-card bg-white p-6 shadow-soft md:p-8">
      <Honeypot />

      <fieldset>
        <legend className="mb-4 font-display font-semibold text-ink">Choose an amount</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tiers.map((tier) => {
            const active = selectedTier === tier._id
            return (
              <button
                type="button"
                key={tier._id}
                onClick={() => chooseTier(tier._id)}
                aria-pressed={active}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors',
                  active
                    ? 'border-brand-pink-deep bg-brand-pink-soft'
                    : 'border-brand-pink-soft bg-white hover:border-brand-pink',
                )}
              >
                <span className="flex items-center gap-2">
                  <DonationGlyph icon={tier.icon} className="h-5 w-5 text-brand-pink-deep" />
                  <span className="font-display text-lg font-bold text-ink">${tier.amount}</span>
                </span>
                <span className="text-xs leading-snug text-ink-muted">{tier.label}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <Field label="Or enter any amount (USD)" name="customAmount" error={errors.amount}>
          <TextInput
            id="customAmount"
            name="customAmount"
            type="number"
            min="1"
            step="0.01"
            inputMode="decimal"
            placeholder="e.g. 50"
            value={customAmount}
            onChange={(event) => chooseCustom(event.target.value)}
          />
        </Field>
      </div>

      {activeTier && (
        <p className="mt-3 rounded-xl bg-brand-teal-soft px-4 py-3 text-sm text-brand-teal-deep">
          ${activeTier.amount} — {activeTier.description}
        </p>
      )}

      {/* Payment method comes before the donor's details because the phone
          field's label and requiredness depend on which method is chosen. */}
      <fieldset className="mt-6">
        <legend className="mb-3 font-display font-semibold text-ink">
          How would you like to pay?
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {methods.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors',
                method === option.value
                  ? 'border-brand-teal-deep bg-brand-teal-soft'
                  : 'border-brand-pink-soft hover:border-brand-teal',
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={method === option.value}
                onChange={() => setMethod(option.value)}
                className="mt-1 accent-[#0a6070]"
              />
              <span>
                <span className="block font-display text-sm font-semibold text-ink">
                  {option.label}
                </span>
                <span className="block text-xs text-ink-muted">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name} hint="Optional">
          <TextInput id="name" name="name" autoComplete="name" />
        </Field>
        {/* One phone field, not two: for mobile money the wallet being charged
            is the donor's own number, so asking twice would be confusing. */}
        <Field
          label={isMobileMoney ? 'Mobile number to charge' : 'Phone or WhatsApp'}
          name="phone"
          error={errors.phone}
          hint={
            isMobileMoney
              ? 'The number registered for this wallet'
              : 'So we can thank you. Optional if you give an email.'
          }
          required={isMobileMoney}
        >
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0771 234 567"
            required={isMobileMoney}
            aria-invalid={errors.phone ? true : undefined}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Email address" name="email" error={errors.email} hint="Optional">
          <TextInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
          />
        </Field>
      </div>

      <div className="mt-6">
        <FormMessage status={status} message={message} />
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === 'submitting'}>
        {status === 'submitting'
          ? 'Starting payment…'
          : amount > 0
            ? `Donate $${amount.toFixed(2)}`
            : 'Donate'}
      </Button>

      <p className="mt-4 text-center text-xs text-ink-muted">
        Payments are processed securely by Paynow. We never see or store your card or wallet
        details.
      </p>
    </form>
  )
}
