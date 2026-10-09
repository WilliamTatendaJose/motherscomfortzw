import { beforeEach, describe, expect, it, vi } from 'vitest'

const persist = vi.fn()
const sendNotification = vi.fn()

vi.mock('@/lib/sanity/writeClient', () => ({ persist }))
vi.mock('@/lib/email', () => ({ sendNotification }))
vi.mock('@/lib/rateLimit', () => ({
  rateLimit: () => ({ allowed: true, retryAfterSeconds: 0 }),
  clientIp: () => '127.0.0.1',
}))

const { POST } = await import('./route')

const contact = {
  name: 'Tendai',
  phone: '0771234567',
  subject: 'Hello',
  message: 'I would like to know more about your work.',
}

function submit(body: unknown) {
  const request = new Request('http://localhost/api/forms/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return POST(request, { params: Promise.resolve({ type: 'contact' }) })
}

describe('POST /api/forms/[type]', () => {
  beforeEach(() => {
    persist.mockReset()
    sendNotification.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('succeeds when the submission is stored and emailed', async () => {
    persist.mockResolvedValue({ _id: 'abc' })
    sendNotification.mockResolvedValue(true)

    const response = await submit(contact)
    expect(response.status).toBe(200)
    expect((await response.json()).ok).toBe(true)
  })

  it('succeeds when only storage works', async () => {
    persist.mockResolvedValue({ _id: 'abc' })
    sendNotification.mockResolvedValue(false)

    expect((await submit(contact)).status).toBe(200)
  })

  it('succeeds when only email works', async () => {
    persist.mockResolvedValue(null)
    sendNotification.mockResolvedValue(true)

    expect((await submit(contact)).status).toBe(200)
  })

  it('reports failure when the message was neither stored nor emailed', async () => {
    persist.mockResolvedValue(null)
    sendNotification.mockResolvedValue(false)

    const response = await submit(contact)
    const result = await response.json()

    expect(response.status).toBe(503)
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(/could not send/)
  })

  it('still fakes success for a filled honeypot without doing any work', async () => {
    const response = await submit({ ...contact, website: 'http://spam.example' })

    expect(response.status).toBe(200)
    expect(persist).not.toHaveBeenCalled()
    expect(sendNotification).not.toHaveBeenCalled()
  })
})
