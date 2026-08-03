'use client'

import { pipeline } from '@/config/pipeline'

/**
 * The pipeline without WebGL: a flat horizontal track with the same five gates.
 *
 * The active gate still advances with scroll, because the parent passes the
 * same `active` index the 3D scene uses. The information and the interaction
 * survive; only the dimension is gone.
 */
export function PipelineFallback({ active }: { active: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        <div className="relative">
          {/* track */}
          <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-line-subtle" />

          {/* travelled portion */}
          <div
            className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-accent"
            style={{
              width: `${(active / Math.max(pipeline.length - 1, 1)) * 100}%`,
              boxShadow: '0 0 12px var(--accent-glow)',
              transition: 'width 420ms var(--ease-out)',
            }}
          />

          <ol className="relative flex items-center justify-between">
            {pipeline.map((stage, index) => {
              const reached = index <= active
              return (
                <li key={stage.id} className="flex flex-col items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="block rounded-full border"
                    style={{
                      width: index === active ? 16 : 10,
                      height: index === active ? 16 : 10,
                      background: reached ? 'var(--accent)' : 'var(--bg-void)',
                      borderColor: reached ? 'var(--accent)' : 'var(--line-subtle)',
                      boxShadow: index === active ? '0 0 16px var(--accent-glow)' : 'none',
                      transition: 'all 380ms var(--ease-out)',
                    }}
                  />
                  <span
                    className="font-mono text-label-xs uppercase"
                    style={{ color: reached ? 'var(--accent)' : 'var(--text-faint)' }}
                  >
                    {stage.title}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default PipelineFallback
