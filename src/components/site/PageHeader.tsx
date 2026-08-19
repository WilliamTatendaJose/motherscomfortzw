import Image from 'next/image'

export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow?: string
  title: string
  intro?: string
  image?: {
    url: string
    alt: string
  }
}) {
  return (
    <div className="border-b border-brand-pink-soft bg-brand-pink-tint">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-3 font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-tight md:text-5xl">{title}</h1>
          {intro && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</p>}
        </div>
        {image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-brand-teal-soft shadow-lift ring-8 ring-white/60">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-6 pt-16">
              <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 font-display text-xs font-bold tracking-[0.12em] text-brand-teal-deep uppercase">
                With mothers, every step
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
