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
 * "29+" rather than a permanent "0+".
 *
 * A component that animates from 0 on mount would ship 0 in the HTML — which
 * is the number a crawler reads.
 */
function CountedStat({ value, suffix }: { value: number; suffix: string }) {
  const reduced = useReducedMotion()
  const [animate, setAnimate] = useState(false)
  const counted = useCountUp(value, { active: animate, duration: 1100 })

  useEffect(() => {
    if (reduced) return
    setAnimate(true)
  }, [reduced])

  const display = animate ? Math.round(counted) : value

  return (
    <>
      {display}
      {suffix}
    </>
  )
}

export function Stats() {
  return (
    /*
     * A 2×2 grid capped at ~28rem rather than a single flexible row.
     *
     * The globe is offset into the right of the hero, and a four-across row
     * runs the last two figures straight into the densest part of it — cyan
     * numerals on glowing cyan nodes, which is unreadable. Keeping the block
     * narrow holds every figure over flat background.
     */
    <dl className="grid max-w-sm grid-cols-2 gap-x-10 gap-y-6">
      {site.stats.map((stat) => (
        <div key={stat.label}>
          <dd className="font-display text-display-md font-bold tabular-nums text-accent">
            {/*
              Narrowed rather than defaulted: a stat is either a number that can
              be counted up, or a phrase that cannot. Tweening "Top 1%" would
              mean animating through ranks that were never true.
            */}
            {'display' in stat ? (
              stat.display
            ) : (
              <CountedStat value={stat.value} suffix={stat.suffix} />
            )}
          </dd>
          <dt className="mt-1 font-mono text-label-sm uppercase text-ink-muted">{stat.label}</dt>
          <dd className="mt-0.5 font-mono text-label-xs text-ink-faint">{stat.of}</dd>
        </div>
      ))}
    </dl>
  )
}

export default Stats
