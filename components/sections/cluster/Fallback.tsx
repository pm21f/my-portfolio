'use client'

import { maxPodsPerNode, workers } from '@/config/cluster'

/**
 * The cluster without WebGL.
 *
 * A radial diagram would be pointless in CSS; instead this gives each node a
 * pod grid, which is arguably a CLEARER read of "where did the new pods land"
 * than the orbiting version. The scale-up button drives it identically.
 */
export function ClusterFallback({
  perWorker,
  hovered,
}: {
  perWorker: number[]
  hovered: number | null
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-2 py-4">
      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker, index) => (
          <div
            key={worker.id}
            className="glass rounded-lg p-3"
            style={{
              borderColor: hovered === index ? 'var(--accent)' : undefined,
              transition: 'border-color 220ms var(--ease-out)',
            }}
          >
            <p className="mb-1 font-mono text-label-xs uppercase text-accent">{worker.id}</p>
            <p className="mb-3 font-mono text-label-xs text-ink-muted">{worker.zone}</p>

            <div className="flex flex-wrap gap-1" aria-hidden="true">
              {Array.from({ length: maxPodsPerNode }, (_, slot) => {
                const filled = slot < (perWorker[index] ?? 0)
                return (
                  <span
                    key={slot}
                    className="block h-2.5 w-2.5 rounded-[2px]"
                    style={{
                      background: filled ? 'var(--signal-ok)' : 'transparent',
                      border: `1px solid ${filled ? 'var(--signal-ok)' : 'var(--line-subtle)'}`,
                      boxShadow: filled ? '0 0 6px rgba(52,211,153,0.5)' : 'none',
                      transition: 'all 320ms var(--ease-out)',
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClusterFallback
