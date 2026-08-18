import type { ImpactMetric } from '@/lib/content/types'

export function ImpactMetrics({ metrics }: { metrics: ImpactMetric[] }) {
  if (metrics.length === 0) return null

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {metrics.map((metric) => (
        <li key={metric._id} className="rounded-card bg-white p-7 shadow-soft">
          <p className="font-display text-4xl leading-none font-bold text-brand-pink-deep">
            {metric.value}
          </p>
          <p className="mt-3 font-display font-semibold text-ink">{metric.label}</p>
          {metric.description && (
            <p className="mt-3 leading-relaxed text-ink-muted">{metric.description}</p>
          )}
        </li>
      ))}
    </ul>
  )
}
