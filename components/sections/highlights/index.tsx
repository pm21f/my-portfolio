import { site } from '@/config/site'

/**
 * HIGHLIGHTS — the two claims that outrank everything else on the page.
 *
 * Placed immediately under the hero, before the pipeline, because a visitor
 * who reads exactly one thing after the name should read these.
 *
 * On "bright": the emphasis is built from SIZE, SPACE and GLOW rather than
 * from new colour. The site has one accent by design, and the fastest way to
 * make a portfolio look like a template is to reach for a second hue whenever
 * something needs to feel important. So these get the largest type on the page
 * after the name, a lit rule, a halo behind the figure, and a great deal of
 * room — which reads as confidence, where a gold gradient would read as noise.
 *
 * A server component: these are the highest-value sentences on the site for
 * both a recruiter and a crawler, so they ship in the HTML.
 */
export function Highlights() {
  return (
    <section
      id="highlights"
      aria-label="Career highlights"
      className="relative overflow-hidden border-y border-line-subtle px-6 py-24 lg:px-24 lg:py-32"
    >
      {/* Ambient wash — the only decorative light in the band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(34,211,238,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-14 flex items-center gap-4 font-mono text-label-md uppercase text-ink-muted">
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          Selected record
        </p>

        <ul className="grid gap-x-16 gap-y-16 md:grid-cols-2">
          {site.highlights.map((highlight) => (
            <li key={highlight.id} className="group relative">
              {/* Halo behind the figure. Sits under the text, never over it. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-6 -top-8 h-40 w-40 rounded-full opacity-60 blur-3xl"
                style={{ background: 'rgba(34,211,238,0.18)' }}
              />

              <div className="relative">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-label-xs uppercase text-accent">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent"
                    style={{ boxShadow: '0 0 8px var(--accent)' }}
                  />
                  {highlight.badge}
                </p>

                {/*
                  The unit sits UNDER the figure, not beside it. Baseline-
                  aligning a 12px label to a 7rem numeral strands it far to the
                  right, visually detached from the number it qualifies —
                  stacking keeps the pair reading as one unit.
                */}
                <p
                  className="font-display font-bold leading-[0.85] text-accent-gradient"
                  style={{
                    fontSize: 'clamp(3.5rem, 9vw, 7rem)',
                    letterSpacing: '-0.04em',
                    // A glow on the numeral itself, so it reads as lit rather
                    // than merely large.
                    filter: 'drop-shadow(0 0 28px rgba(34,211,238,0.35))',
                  }}
                >
                  {highlight.figure}
                </p>
                <p className="mt-3 font-mono text-label-md uppercase text-ink-muted">
                  {highlight.unit}
                </p>

                <h2 className="mt-4 font-display text-display-md font-bold text-ink">
                  {highlight.title}
                </h2>

                <p className="mt-3 max-w-md font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
                  {highlight.detail}
                </p>

                {/* Lit rule — extends on hover, the same language as the nav. */}
                <span
                  aria-hidden="true"
                  className="mt-6 block h-px bg-accent transition-all duration-slow ease-out"
                  style={{ width: '3rem', boxShadow: '0 0 12px var(--accent-glow)' }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Highlights
