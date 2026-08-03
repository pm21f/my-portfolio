'use client'

import { useEffect, useState } from 'react'
import { BOOT_STEPS, markBooted, useBootProgress, useBootSequence } from '@/lib/boot'
import { setCursor } from '@/lib/cursor'
import { useReducedMotion } from '@/lib/motion'
import { site } from '@/config/site'

/**
 * Boot screen.
 *
 * Sits OVER the page rather than replacing it — the real content is already
 * rendered and painted underneath. That matters for the LCP budget: if the
 * preloader gated rendering, the largest element wouldn't exist until the bar
 * finished, and we'd be measuring the preloader's patience as the page's speed.
 *
 * It is aria-hidden and non-focusable throughout. A screen reader user gets the
 * document immediately; there is nothing here they need.
 */
export function Preloader() {
  useBootSequence()
  const { completed, progress } = useBootProgress()
  const reduced = useReducedMotion()

  const [dismissed, setDismissed] = useState(false)
  const [removed, setRemoved] = useState(false)
  // Displayed percentage trails the real one so the bar reads as motion rather
  // than four jumps. It never leads — this can only lag the truth, not invent it.
  const [shown, setShown] = useState(0)

  /* The final step closes once everything real has reported in. */
  useEffect(() => {
    const core = ['dom', 'device', 'fonts', 'scene']
    if (core.every((key) => completed.includes(key))) markBooted('ready')
  }, [completed])

  useEffect(() => {
    setCursor('hidden')
    return () => setCursor('default')
  }, [])

  useEffect(() => {
    if (reduced) {
      setShown(progress)
      return
    }
    let raf = 0
    const tick = () => {
      setShown((current) => {
        const next = current + (progress - current) * 0.12
        return Math.abs(progress - next) < 0.001 ? progress : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, reduced])

  useEffect(() => {
    if (progress < 1) return
    // Hold a beat at 100% — dismissing the instant the last step lands makes
    // the completion feel like a glitch rather than a finish.
    const exit = setTimeout(() => {
      setDismissed(true)
      setCursor('default')
    }, reduced ? 0 : 320)
    return () => clearTimeout(exit)
  }, [progress, reduced])

  useEffect(() => {
    if (!dismissed) return
    const cleanup = setTimeout(() => setRemoved(true), reduced ? 0 : 700)
    return () => clearTimeout(cleanup)
  }, [dismissed, reduced])

  if (removed) return null

  const percent = Math.round(shown * 100)

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center bg-void"
      style={{
        zIndex: 80,
        opacity: dismissed ? 0 : 1,
        // The overlay lifts away from the viewer as it exits, so the site
        // appears to be revealed by a camera move rather than a cross-fade.
        transform: dismissed ? 'scale(1.06)' : 'scale(1)',
        transition: reduced
          ? 'none'
          : 'opacity 600ms var(--ease-out), transform 700ms var(--ease-dolly)',
        pointerEvents: dismissed ? 'none' : 'auto',
      }}
    >
      <div className="w-full max-w-md px-6">
        <div className="mb-8 flex items-baseline justify-between">
          <span className="font-mono text-label-sm uppercase tracking-[0.18em] text-ink-muted">
            {site.name}
          </span>
          <span
            className="font-mono text-label-sm text-accent tabular-nums"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {String(percent).padStart(3, '0')}%
          </span>
        </div>

        {/* progress rail */}
        <div className="mb-8 h-px w-full bg-line-subtle">
          <div
            className="h-px bg-accent"
            style={{
              width: `${percent}%`,
              boxShadow: '0 0 12px var(--accent-glow)',
              transition: reduced ? 'none' : 'width 120ms linear',
            }}
          />
        </div>

        {/* boot log */}
        <ul className="space-y-1.5 font-mono text-label-sm">
          {BOOT_STEPS.map((step) => {
            const isDone = completed.includes(step.key)
            return (
              <li
                key={step.key}
                className="flex items-center gap-3"
                style={{
                  color: isDone ? 'var(--text-secondary)' : 'var(--text-faint)',
                  transition: 'color 300ms var(--ease-out)',
                }}
              >
                <span
                  className="w-4 shrink-0"
                  style={{ color: isDone ? 'var(--signal-ok)' : 'var(--text-faint)' }}
                >
                  {isDone ? 'OK' : '··'}
                </span>
                <span>{step.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Preloader
