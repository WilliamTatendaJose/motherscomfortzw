'use client'

import {
  Field,
  FormMessage,
  Honeypot,
  Select,
  TextArea,
  TextInput,
} from '@/components/forms/Field'
import { useFormSubmit } from '@/components/forms/useFormSubmit'
import { Button } from '@/components/ui/Button'

const interests = [
  { value: 'volunteering', label: 'Volunteering my time' },
  { value: 'partnership', label: 'Partnering with Mother’s Comfort' },
  { value: 'donation-drive', label: 'Running a donation drive' },
  { value: 'skills-training', label: 'Teaching a skills training course' },
  { value: 'other', label: 'Something else' },
]

export function VolunteerForm() {
  const { status, message, errors, submit } = useFormSubmit(
    '/api/forms/volunteer',
    'Thank you for offering to help. We will be in touch soon.',
  )

  return (
    <form onSubmit={submit} className="relative space-y-5" noValidate>
      <Honeypot />

      <Field label="Your name" name="name" error={errors.name} required>
        <TextInput
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={errors.name ? true : undefined}
        />
      </Field>

      {/* Phone first and email optional — see ContactForm. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Phone or WhatsApp"
          name="phone"
          error={errors.phone}
          hint="How most people reach us"
        >
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0771 234 567"
            aria-invalid={errors.phone ? true : undefined}
          />
        </Field>
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

      <Field label="How would you like to help?" name="interest" error={errors.interest}>
        <Select id="interest" name="interest" defaultValue="volunteering">
          {interests.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Tell us more" name="message" error={errors.message} hint="Optional">
        <TextArea id="message" name="message" rows={4} />
      </Field>

      <FormMessage status={status} message={message} />

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Count me in'}
      </Button>
    </form>
  )
}
