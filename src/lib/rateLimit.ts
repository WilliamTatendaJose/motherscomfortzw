import 'server-only'

/**
 * Fixed-window rate limiter held in module memory.
 *
 * This is deliberately simple and has a real limitation: serverless instances
 * do not share memory, so the effective limit is per-instance, not global. It
 * still stops the naive case (one client hammering one endpoint) which is what
 * we need here. If abuse becomes a real problem, swap the two functions below
 * for Upstash Redis — no caller changes.
 */

type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

/** Evict expired entries so the map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 500) return
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key)
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  sweep(now)

  const entry = buckets.get(key)

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  entry.count += 1

  if (entry.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
