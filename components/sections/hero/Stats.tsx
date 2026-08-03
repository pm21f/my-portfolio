'use client'

import { useEffect, useState } from 'react'
import { useCountUp, useReducedMotion } from '@/lib/motion'
import { site } from '@/config/site'

/**
 * Headline figures with a count-up.
 *
 * The number renders at its FINAL value on the server and on the first client
 * paint, then the animation resets to zero and runs. That ordering is
 * deliberate: with no JavaScript, or before hydration, the page still shows
 * "2+" rather than a permanent "0+".
 *
 * A component that animates from 0 on mount would ship 0 in the HTML — which
 * is the number a crawler reads.
 */
function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const reduced = useReducedMotion()
  const [animate, setAnimate] = useState(false)
  const counted = useCountUp(value, { active: animate, duration: 1100 })

  useEffect(() => {
    if (reduced) return
    setAnimate(true)
  }, [reduced])

  const display = animate ? Math.round(counted) : value

  return (
    <div>
      <div className="font-display text-display-md font-bold tabular-nums text-accent">
        {display}
        {suffix}
      </div>
      <div className="mt-1 font-mono text-label-sm uppercase text-ink-muted">{label}</div>
    </div>
  )
}

export function Stats() {
  return (
    <dl className="flex flex-wrap gap-x-12 gap-y-6">
      {site.stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <Stat value={stat.value} suffix={stat.suffix} label={stat.label} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default Stats
