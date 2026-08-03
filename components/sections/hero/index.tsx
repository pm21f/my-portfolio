import { site } from '@/config/site'
import HeroCanvas from './HeroCanvas'
import Stats from './Stats'
import TerminalLine from './TerminalLine'

/**
 * HERO — section 00.
 *
 * A server component. The <h1>, the role, the location and the links are all
 * in the HTML response; the canvas is decorative and lives behind them. Turn
 * JavaScript off and this section still says who Piyush is and how to reach him.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 py-32 lg:px-24"
    >
      <div aria-hidden="true" className="grid-overlay absolute inset-0" />
      <HeroCanvas />

      <div className="relative mx-auto w-full max-w-6xl" style={{ zIndex: 10 }}>
        {site.availability.open ? (
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-label-sm uppercase text-signal-ok">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-ok"
              style={{ boxShadow: '0 0 8px var(--signal-ok)' }}
            />
            {site.availability.label}
          </p>
        ) : null}

        {/*
          The name is one <h1>. The line break is presentational, so it's a
          <span> with a block display rather than two headings — a document
          outline with two h1s is a genuine accessibility defect.
        */}
        <h1 className="mb-6 font-display text-display-xl font-bold leading-[0.88] tracking-[-0.04em]">
          <span className="block text-ink">{site.nameParts[0]}</span>
          <span className="block text-accent-gradient">{site.nameParts[1]}</span>
        </h1>

        <div className="mb-10 max-w-xl space-y-3">
          <TerminalLine />
          <p className="font-mono text-body-sm text-ink-muted">
            <span className="text-accent">◆</span> {site.location}
          </p>
        </div>

        <p className="mb-12 max-w-lg font-mono text-body-md leading-relaxed text-ink-secondary text-pretty">
          {site.tagline} {site.description}
        </p>

        <div className="mb-14">
          <Stats />
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={`mailto:${site.email}`}
            className="rounded-md bg-accent px-5 py-2.5 font-mono text-label-md font-semibold uppercase text-void transition-all duration-fast hover:bg-accent-hot hover:shadow-glow-strong"
          >
            Get in touch
          </a>
          {site.socials
            .filter((social) => social.label !== 'Email')
            .map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-line px-5 py-2.5 font-mono text-label-md uppercase text-ink-secondary transition-all duration-fast hover:border-accent hover:text-accent"
              >
                {social.label}
              </a>
            ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
