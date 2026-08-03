'use client'

import { useMemo } from 'react'
import { metricNoise } from '@/config/metrics'

/**
 * The metrics wall as static CSS bars.
 *
 * Sampled once at a fixed time rather than animated — on the devices that get
 * this path, an animation of 60 elements would be the most expensive thing on
 * screen for no informational gain.
 */
export function ObservabilityFallback() {
  const bars = useMemo(
    () => Array.from({ length: 48 }, (_, index) => metricNoise(index, 4.2)),
    [],
  )

  return (
    <div className="absolute inset-0 flex items-end gap-[3px] px-2 pb-2" aria-hidden="true">
      {bars.map((value, index) => (
        <span
          key={index}
          className="block flex-1 rounded-[1px]"
          style={{
            height: `${12 + value * 78}%`,
            background: value > 0.78 ? 'var(--signal-warn)' : 'var(--accent)',
            opacity: 0.25 + value * 0.55,
          }}
        />
      ))}
    </div>
  )
}

export default ObservabilityFallback
