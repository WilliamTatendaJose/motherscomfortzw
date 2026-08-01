'use client'

import { useState } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

type SubmitResult = {
  ok: boolean
  message?: string
  errors?: Record<string, string>
}

/**
 * Shared submit handling for the contact, volunteer and newsletter forms:
 * posts JSON, surfaces per-field errors from the server, and keeps a status
 * for the button state.
 */
export function useFormSubmit(endpoint: string, successMessage: string) {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())

    setStatus('submitting')
    setErrors({})
    setMessage('')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = (await response.json()) as SubmitResult

      if (!response.ok || !result.ok) {
        setStatus('error')
        setErrors(result.errors ?? {})
        setMessage(result.message ?? 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage(result.message ?? successMessage)
      form.reset()
    } catch {
      setStatus('error')
      setMessage('We could not reach the server. Please check your connection and try again.')
    }
  }

  return { status, message, errors, submit }
}
