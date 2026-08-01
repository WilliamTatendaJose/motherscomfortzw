import { createClient, type SanityClient } from 'next-sanity'

import { isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from '@/lib/env'

/**
 * Read client for published content. `null` until a Sanity project is configured,
 * which lets the whole site render from `src/content` fallbacks in the meantime.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null

/**
 * Fetch a GROQ query, tagged so the Sanity webhook can revalidate it precisely.
 * Returns `null` on missing config or any query failure — content pages must
 * degrade to fallbacks rather than 500 because the CMS blipped.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  if (!sanityClient) return null

  try {
    return await sanityClient.fetch<T>(query, params, {
      next: { tags, revalidate: 3600 },
    })
  } catch (error) {
    console.error('[sanity] query failed, falling back to static content', {
      query: query.slice(0, 120),
      error: error instanceof Error ? error.message : error,
    })
    return null
  }
}
