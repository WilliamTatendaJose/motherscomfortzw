/**
 * Environment access.
 *
 * The site is built to run *before* the Sanity project exists, so nothing here
 * throws on a missing value. Instead `isSanityConfigured` gates the CMS layer
 * and pages fall back to the seeded content in `src/content`. Secrets are read
 * lazily inside server-only modules so they never land in a client bundle.
 */

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01'

/** A Sanity project id is 8+ lowercase alphanumerics; anything else is a placeholder. */
export const isSanityConfigured = /^[a-z0-9]{8,}$/.test(sanityProjectId)

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')

/** Reads a server-only secret. Returns '' when unset so callers can degrade. */
export function serverEnv(key: string): string {
  return process.env[key] ?? ''
}

/** Throws with an actionable message. Use at the point of use, never at import time. */
export function requireServerEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable ${key}. See .env.example and set it in Vercel > Project Settings > Environment Variables.`,
    )
  }
  return value
}
