'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import SceneGate from '@/components/three/SceneGate'
import { useScrollProgress } from '@/lib/scroll'
import { pipeline } from '@/config/pipeline'
import PipelineFallback from './Fallback'

const PipelineCanvas = dynamic(() => import('./PipelineCanvas'), { ssr: false })

/**
 * The scroll-through pipeline.
 *
 * Layout is a tall outer section with a sticky viewport-height stage. Sticky
 * rather than a GSAP pin: pinning rewrites the document with spacer elements
 * and fights Lenis over scroll position, while `position: sticky` is handled by
 * the compositor and costs nothing.
 *
 * IMPORTANT — every stage's prose is in the DOM at all times, not just the
 * active one. Inactive panels are transparent, not unmounted. That keeps all
 * five stages in the server-rendered HTML for crawlers and lets a screen reader
 * walk the whole ordered list, while the eye only ever sees one.
 */
export function PipelineViewer() {
  const [active, setActive] = useState(0)

  // Fires on every scroll frame, so it must stay cheap: derive the index and
  // only touch React state when the bucket actually changes.
  const onUpdate = useCallback((progress: number) => {
    const index = Math.min(
      pipeline.length - 1,
      Math.max(0, Math.round(progress * (pipeline.length - 1))),
    )
    setActive((current) => (current === index ? current : index))
  }, [])

  const [ref, progress] = useScrollProgress<HTMLDivElement>({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate,
  })

  return (
    <div ref={ref} style={{ height: `${pipeline.length * 80}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <SceneGate fallback={<PipelineFallback active={active} />}>
          <PipelineCanvas progress={progress} activeIndex={active} />
        </SceneGate>

        {/*
          A scrim under the overlay. The pipe is a bright object that moves, so
          overlay text sitting directly on it loses contrast unpredictably as
          the geometry passes behind — a gradient from the bottom guarantees
          the panel and rail stay readable at every scroll position.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              'linear-gradient(to top, var(--bg-void) 8%, rgba(5,7,10,0.82) 38%, transparent 100%)',
          }}
        />

        {/* ── overlay: real DOM, outside the canvas, so it stays accessible ── */}
        <div className="pointer-events-none relative flex h-full flex-col justify-end px-6 pb-16 lg:px-24 lg:pb-24">
          {/* stage rail */}
          <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
            {pipeline.map((stage, index) => (
              <li
                key={stage.id}
                className="flex items-center gap-2 font-mono text-label-sm uppercase"
                style={{
                  color: index === active ? 'var(--accent)' : 'var(--text-faint)',
                  transition: 'color 320ms var(--ease-out)',
                }}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-1 w-1 rounded-full"
                  style={{
                    background: 'currentColor',
                    boxShadow: index === active ? '0 0 8px var(--accent)' : 'none',
                  }}
                />
                {stage.title}
              </li>
            ))}
          </ol>

          {/* stacked panels — all present, one visible */}
          <div className="relative h-[19rem] max-w-2xl sm:h-[15rem]">
            {pipeline.map((stage, index) => {
              const isActive = index === active
              return (
                <article
                  key={stage.id}
                  aria-current={isActive ? 'step' : undefined}
                  className="glass absolute inset-0 rounded-xl p-6"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: `translateY(${isActive ? 0 : 12}px)`,
                    transition: 'opacity 380ms var(--ease-out), transform 380ms var(--ease-out)',
                    // Keep transparent panels out of hit-testing; they're stacked
                    // on top of each other and would swallow pointer events.
                    pointerEvents: 'none',
                  }}
                >
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <p className="font-mono text-label-sm text-accent">
                      <span className="text-ink-faint">$</span> {stage.command}
                    </p>
                    <p className="shrink-0 font-mono text-label-xs uppercase text-ink-muted">
                      {stage.duration}
                    </p>
                  </div>

                  <h3 className="mb-2 font-display text-display-md font-bold text-ink">
                    {stage.title}
                  </h3>

                  <p className="mb-4 font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
                    {stage.summary}
                  </p>

                  <ul className="flex flex-wrap gap-2">
                    {stage.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded border border-line-subtle px-2 py-0.5 font-mono text-label-xs text-ink-muted"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PipelineViewer
