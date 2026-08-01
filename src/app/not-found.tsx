import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-pink-tint px-5 py-20">
      <div className="text-center">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-brand-pink-deep uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl">We couldn&rsquo;t find that page</h1>
        <p className="mt-4 text-lg text-ink-muted">
          It may have moved, or the link may be out of date.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-brand-pink-deep px-6 py-3 font-display font-semibold text-white hover:bg-brand-pink"
          >
            Back to home
          </Link>
          <Link
            href="/stories"
            className="rounded-full border-2 border-brand-pink-deep px-6 py-3 font-display font-semibold text-brand-pink-deep hover:bg-brand-pink-soft"
          >
            Read the mothers&rsquo; stories
          </Link>
        </div>
      </div>
    </div>
  )
}
