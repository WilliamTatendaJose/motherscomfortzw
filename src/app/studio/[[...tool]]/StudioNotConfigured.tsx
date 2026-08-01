const steps = [
  {
    command: 'npx sanity login',
    text: 'Sign in (or create) a Sanity account.',
  },
  {
    command: 'npx sanity projects create "Mother\'s Comfort"',
    text: 'Create the project and note the project id it prints.',
  },
  {
    command: 'npx sanity dataset create donations --visibility private',
    text: 'Add the private dataset that holds donations and form submissions.',
  },
  {
    command: 'NEXT_PUBLIC_SANITY_PROJECT_ID=…',
    text: 'Put the project id in .env.local, along with a SANITY_WRITE_TOKEN from sanity.io/manage → API → Tokens.',
  },
  {
    command: 'npm run seed',
    text: 'Import the content migrated from the old website, then reload this page.',
  },
]

/**
 * Shown at /studio before a Sanity project exists. The site itself is fully
 * functional in the meantime, rendering the migrated content in src/content.
 */
export function StudioNotConfigured() {
  return (
    <main
      style={{
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        color: '#2b2b3d',
        background: '#fff9fb',
        minHeight: '100vh',
        padding: '4rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
        <p
          style={{
            color: '#c10074',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontSize: '0.8rem',
          }}
        >
          Sanity Studio
        </p>
        <h1 style={{ fontSize: '2rem', margin: '0.75rem 0 0' }}>Not connected yet</h1>
        <p style={{ color: '#5b5b70', lineHeight: 1.7, marginTop: '1rem' }}>
          No Sanity project is configured, so there is nothing to edit here yet. The website is
          running normally in the meantime — it falls back to the content migrated from the previous
          site, so nothing is broken while you set this up.
        </p>

        <ol style={{ marginTop: '2rem', paddingLeft: '1.25rem', lineHeight: 1.7 }}>
          {steps.map((step) => (
            <li key={step.command} style={{ marginBottom: '1.25rem' }}>
              <code
                style={{
                  display: 'inline-block',
                  background: '#fde8f1',
                  color: '#c10074',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.9rem',
                }}
              >
                {step.command}
              </code>
              <span style={{ display: 'block', color: '#5b5b70', marginTop: '0.35rem' }}>
                {step.text}
              </span>
            </li>
          ))}
        </ol>

        <p style={{ color: '#5b5b70', marginTop: '2rem' }}>
          Full instructions are in the project README.{' '}
          <a href="/" style={{ color: '#c10074' }}>
            Back to the website
          </a>
        </p>
      </div>
    </main>
  )
}
