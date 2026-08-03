'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { metricValue, panels } from '@/config/metrics'

/**
 * The numeric readouts beside the wall.
 *
 * Driven by the same `metricValue` generator as the 3D bars, sampled from the
 * same clock, so a spike on the wall coincides with a spike in the number.
 *
 * Updates are throttled to ~6/s rather than running at frame rate. Digits that
 * change 60 times a second are unreadable, and this is React state — re-rendering
 * six panels every frame for an effect nobody can perceive would be the most
 * expensive thing on the page.
 */
export function Readouts() {
  const reduced = useReducedMotion()
  const [values, setValues] = useState<number[]>(() =>
    panels.map((panel, index) => metricValue(panel, index, 0)),
  )
  const startedAt = useRef<number | null>(null)

  useEffect(() => {
    // Frozen values under reduced motion: the information is the point, the
    // flicker isn't.
    if (reduced) return

    const interval = setInterval(() => {
      if (startedAt.current === null) startedAt.current = performance.now()
      const elapsed = (performance.now() - startedAt.current) / 1000
      setValues(panels.map((panel, index) => metricValue(panel, index, elapsed)))
    }, 160)

    return () => clearInterval(interval)
  }, [reduced])

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
      {panels.map((panel, index) => {
        const value = values[index]
        const drift = value - panel.baseline
        const healthy = panel.inverse ? drift <= 0 : drift >= 0

        return (
          <div key={panel.id}>
            <dt className="mb-1 font-mono text-label-xs uppercase text-ink-muted">
              {panel.label}
            </dt>
            <dd className="flex items-baseline gap-1.5">
              <span
                className="font-display text-display-md font-bold tabular-nums text-ink"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {value.toFixed(panel.precision)}
              </span>
              <span className="font-mono text-label-sm text-ink-muted">{panel.unit}</span>
              <span
                aria-hidden="true"
                className="font-mono text-label-xs"
                style={{ color: healthy ? 'var(--signal-ok)' : 'var(--signal-warn)' }}
              >
                {drift >= 0 ? '▲' : '▼'}
              </span>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export default Readouts
