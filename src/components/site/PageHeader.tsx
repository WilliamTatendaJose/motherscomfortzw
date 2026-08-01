export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string
  title: string
  intro?: string
}) {
  return (
    <div className="border-b border-brand-pink-soft bg-brand-pink-tint">
      <div className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-tight md:text-5xl">{title}</h1>
          {intro && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</p>}
        </div>
      </div>
    </div>
  )
}
