import Hero from '@/components/sections/hero'
import Pipeline from '@/components/sections/pipeline'
import Cluster from '@/components/sections/cluster'
import Skills from '@/components/sections/skills'
import Experience from '@/components/sections/experience'
import Projects from '@/components/sections/projects'
import Observability from '@/components/sections/observability'
import Contact from '@/components/sections/contact'
import { site } from '@/config/site'
import { experience } from '@/config/experience'
import { skills } from '@/config/skills'

/**
 * Structured data.
 *
 * Built from the same config the page renders, so it can't drift out of sync
 * with what a visitor actually sees — which is both a maintenance win and the
 * thing search engines penalise when it isn't true.
 */
function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    email: `mailto:${site.email}`,
    url: site.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Una',
      addressRegion: 'Himachal Pradesh',
      addressCountry: 'IN',
    },
    worksFor: { '@type': 'Organization', name: site.company },
    alumniOf: experience
      .filter((role) => role.company !== site.company)
      .map((role) => ({ '@type': 'Organization', name: role.company })),
    knowsAbout: skills.map((skill) => skill.label),
    sameAs: site.socials
      .filter((social) => !social.href.startsWith('mailto:'))
      .map((social) => social.href),
  }
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is derived from local config, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <main id="main" className="relative">
        <Hero />
        <Pipeline />
        <Cluster />
        <Skills />
        <Experience />
        <Projects />
        <Observability />
        <Contact />
      </main>

      <footer className="border-t border-line-subtle px-6 py-10 lg:px-24">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-label-xs uppercase text-ink-faint">
            © {new Date().getFullYear()} {site.name} — built with Next.js, three.js and
            far too much coffee
          </p>
          <p className="font-mono text-label-xs uppercase text-ink-faint">
            Deployed on Vercel
          </p>
        </div>
      </footer>
    </>
  )
}
