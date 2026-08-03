'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import SceneGate from '@/components/three/SceneGate'
import SectionHeader from '@/components/shell/SectionHeader'
import { useScrollProgress } from '@/lib/scroll'
import { experience } from '@/config/experience'
import { site } from '@/config/site'
import ExperienceFallback from './Fallback'

const SpineCanvas = dynamic(() => import('./SpineCanvas'), { ssr: false })

/**
 * EXPERIENCE — section 04.
 *
 * A client component, but every role's text renders unconditionally, so the
 * server output carries the full history. The only thing state controls is
 * which station glows.
 */
export function Experience() {
  const [active, setActive] = useState(0)

  const onUpdate = useCallback((progress: number) => {
    const index = Math.min(
      experience.length - 1,
      Math.max(0, Math.floor(progress * experience.length)),
    )
    setActive((current) => (current === index ? current : index))
  }, [])

  const [ref, progress] = useScrollProgress<HTMLDivElement>({
    start: 'top center',
    end: 'bottom bottom',
    onUpdate,
  })

  return (
    <section id="experience" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="04" label="Experience">
          Five roles, one <span className="text-accent-gradient">direction</span>.
        </SectionHeader>

        <div ref={ref} className="mt-16 grid gap-10 lg:grid-cols-[180px_1fr]">
          {/* the spine */}
          <div className="relative hidden lg:block">
            <div className="sticky top-0 h-svh">
              <SceneGate fallback={<ExperienceFallback active={active} />}>
                <SpineCanvas progress={progress} activeIndex={active} />
              </SceneGate>
            </div>
          </div>

          {/* the roles */}
          <ol className="space-y-6">
            {experience.map((role, index) => {
              const isActive = index === active
              const isCurrent = role.status === 'current'
              return (
                <li key={role.id}>
                  <article
                    className="glass rounded-xl p-6 transition-all duration-base"
                    style={{
                      borderColor: isActive ? 'var(--line-strong)' : undefined,
                      transform: `translateX(${isActive ? 0 : -4}px)`,
                      opacity: isActive ? 1 : 0.72,
                    }}
                  >
                    <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-display-md font-bold text-ink">
                        {role.role}
                      </h3>
                      <p className="font-mono text-label-md uppercase text-accent">
                        {role.company}
                      </p>
                      {isCurrent ? (
                        <span className="flex items-center gap-1.5 font-mono text-label-xs uppercase text-signal-ok">
                          <span
                            aria-hidden="true"
                            className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-ok"
                          />
                          current
                        </span>
                      ) : null}
                    </div>

                    <p className="mb-4 font-mono text-label-sm uppercase text-ink-muted">
                      <time>{role.period}</time> · {role.location}
                    </p>

                    <ul className="space-y-1.5">
                      {role.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-3 font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty"
                        >
                          <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>

        {/* credentials — small, factual, no separate section */}
        <div className="mt-16 border-t border-line-subtle pt-10">
          <h3 className="mb-5 font-mono text-label-md uppercase text-ink-muted">
            Certifications &amp; awards
          </h3>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {site.credentials.map((credential) => (
              <li key={credential.title} className="flex items-baseline gap-3">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                <span className="font-mono text-body-sm text-ink-secondary">
                  {credential.title}
                  <span className="text-ink-muted">
                    {' '}
                    — {credential.issuer}, {credential.year}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Experience
