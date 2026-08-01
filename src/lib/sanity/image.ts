import type { ContentImage } from '@/lib/content/types'

/**
 * Sanity's CDN accepts transform params directly on the asset URL, so we don't
 * need the image-url builder for the common case. Local fallback images under
 * /images are passed through untouched.
 */
export function imageUrl(
  image: ContentImage | null | undefined,
  opts: { width?: number; height?: number; quality?: number } = {},
): string | null {
  if (!image?.url) return null
  if (!image.url.startsWith('https://cdn.sanity.io')) return image.url

  const params = new URLSearchParams({ auto: 'format', fit: 'max' })
  if (opts.width) params.set('w', String(opts.width))
  if (opts.height) params.set('h', String(opts.height))
  params.set('q', String(opts.quality ?? 80))

  return `${image.url}?${params.toString()}`
}

/**
 * GROQ projection for an image field. Kept in one place so every query returns
 * the same shape and alt text is never accidentally dropped.
 */
export const imageProjection = `{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio
}`
