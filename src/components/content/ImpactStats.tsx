import type { ImpactStat } from '@/lib/content/types'

export function ImpactStats({ stats }: { stats: ImpactStat[] }) {
  if (stats.length === 0) return null

  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <li
          key={stat._id}
          className="rounded-card bg-white/10 p-7 ring-1 ring-white/15 backdrop-blur-sm"
        >
          <p className="font-display text-3xl leading-none font-bold text-white md:text-4xl">
            {stat.value}
          </p>
          <p className="mt-3 leading-relaxed text-white/85">{stat.label}</p>
          {/* /90 not /80: the card sits on bg-white/10, which lifts the
              background and costs the smaller text its AA margin. */}
          {stat.source && <p className="mt-3 text-sm text-white/90">Source: {stat.source}</p>}
        </li>
      ))}
    </ul>
  )
}
