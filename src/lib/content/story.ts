import type { Story } from './types'

/**
 * Anonymity is enforced here and nowhere else, so a new template can't
 * accidentally leak a name or a face. When `publishAnonymously` is set the
 * mother's name is replaced and her portrait is suppressed entirely — a
 * portrait may still exist on the document (staff may have uploaded one before
 * she asked to be anonymous), so hiding it must not depend on the field
 * being empty.
 */

export function displayName(story: Story): string {
  return story.publishAnonymously ? 'Anonymous' : story.motherName
}

export function showPortrait(story: Story): boolean {
  return !story.publishAnonymously && Boolean(story.portrait?.url)
}

export function formatStoryDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
