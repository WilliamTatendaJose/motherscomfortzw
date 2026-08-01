import { AlertIcon, InKindGlyph } from '@/components/icons'
import type { InKindItem } from '@/lib/content/types'

export function InKindGrid({ items, warning }: { items: InKindItem[]; warning: string }) {
  const accepted = items.filter((item) => item.accepted)

  return (
    <div>
      <p className="mb-6 font-display font-semibold text-ink">
        We gladly accept new, unused items:
      </p>

      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {accepted.map((item) => (
          <li key={item._id} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink-deep">
              <InKindGlyph icon={item.icon} className="h-8 w-8" />
            </span>
            <span className="text-sm leading-snug text-ink-muted">{item.name}</span>
          </li>
        ))}
      </ul>

      {warning && (
        <p className="mt-8 flex items-start gap-3 rounded-xl bg-brand-teal-soft px-5 py-4">
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-pink-deep" />
          <span>
            <span className="block font-display text-sm font-bold text-brand-pink-deep uppercase">
              Please note
            </span>
            <span className="text-ink-muted">{warning}</span>
          </span>
        </p>
      )}
    </div>
  )
}
