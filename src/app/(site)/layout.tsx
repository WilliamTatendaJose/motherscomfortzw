import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { WhatsAppButton } from '@/components/site/WhatsAppButton'
import { getSiteSettings } from '@/lib/content'
import { getPageSlugs } from '@/lib/content/pages'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, pageSlugs] = await Promise.all([getSiteSettings(), getPageSlugs()])

  return (
    <div className="flex min-h-screen flex-col">
      <Header organisationName={settings.organisationName} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} pageSlugs={pageSlugs} />
      <WhatsAppButton number={settings.whatsapp} />
    </div>
  )
}
