import { ButtonLink } from '@/components/ui/Button'

export function CTABanner({ heading, body }: { heading: string; body: string }) {
  return (
    <section className="bg-brand-pink-deep">
      <div className="container-page flex flex-col items-center gap-6 py-14 text-center md:flex-row md:justify-between md:py-16 md:text-left">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-white md:text-4xl">{heading}</h2>
          <p className="mt-3 text-lg text-white/90">{body}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <ButtonLink href="/donate" variant="onDark">
            Donate now
          </ButtonLink>
          <ButtonLink href="/get-involved" variant="outlineOnDark">
            Get involved
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
