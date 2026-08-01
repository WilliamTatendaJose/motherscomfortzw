'use client'

import { Field, FormMessage, Honeypot, TextArea, TextInput } from '@/components/forms/Field'
import { useFormSubmit } from '@/components/forms/useFormSubmit'
import { Button } from '@/components/ui/Button'

export function ContactForm() {
  const { status, message, errors, submit } = useFormSubmit(
    '/api/forms/contact',
    'Thank you for getting in touch. We will reply as soon as we can.',
  )

  return (
    <form onSubmit={submit} className="relative space-y-5" noValidate>
      <Honeypot />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" error={errors.name} required>
          <TextInput
            id="name"
            name="name"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
          />
        </Field>
        <Field label="Email address" name="email" error={errors.email} required>
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
          />
        </Field>
      </div>

      <Field label="Subject" name="subject" error={errors.subject} required>
        <TextInput
          id="subject"
          name="subject"
          required
          aria-invalid={errors.subject ? true : undefined}
        />
      </Field>

      <Field label="Message" name="message" error={errors.message} required>
        <TextArea
          id="message"
          name="message"
          required
          aria-invalid={errors.message ? true : undefined}
        />
      </Field>

      <FormMessage status={status} message={message} />

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
