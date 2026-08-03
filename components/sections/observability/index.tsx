'use client'

import dynamic from 'next/dynamic'
import SceneGate from '@/components/three/SceneGate'
import SectionHeader from '@/components/shell/SectionHeader'
import { slos } from '@/config/metrics'
import ObservabilityFallback from './Fallback'
import Readouts from './Readouts'

const MetricsCanvas = dynamic(() => import('./MetricsCanvas'), { ssr: false })

/**
 * OBSERVABILITY — section 06.
 *
 * The live-looking numbers are simulated, and the section says so plainly. A
 * dashboard is the right way to show that I think in terms of SLOs and error
 * budgets; passing invented figures off as production telemetry would not be.
 */
export function Observability() {
  return (
    <section id="observability" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="06" label="Telemetry">
          If you can&rsquo;t see it, you can&rsquo;t{' '}
          <span className="text-accent-gradient">operate it</span>.
        </SectionHeader>

        <p className="mb-12 mt-6 max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
          Prometheus scrapes, Grafana draws, Alertmanager wakes someone up. Alerts fire on
          symptoms users feel — latency and error rate — not on CPU graphs that look scary
          but hurt nobody.
        </p>

        <div className="relative mb-12 h-[46svh] min-h-[300px] w-full overflow-hidden rounded-xl border border-line-subtle">
          <SceneGate fallback={<ObservabilityFallback />}>
            <MetricsCanvas />
          </SceneGate>

          <p className="absolute right-4 top-4 rounded border border-line px-2 py-1 font-mono text-label-xs uppercase text-ink-muted backdrop-blur-sm">
            simulated telemetry
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          <div>
            <h3 className="mb-5 font-mono text-label-md uppercase text-ink-secondary">
              Live series
            </h3>
            <Readouts />
          </div>

          <div>
            <h3 className="mb-5 font-mono text-label-md uppercase text-ink-secondary">
              Service objectives
            </h3>
            <dl className="space-y-4">
              {slos.map((slo) => (
                <div key={slo.label} className="flex items-baseline justify-between gap-4 border-b border-line-subtle pb-3">
                  <dt className="font-mono text-label-sm uppercase text-ink-muted">
                    {slo.label}
                  </dt>
                  <dd className="text-right">
                    <span className="font-display text-display-md font-bold text-accent">
                      {slo.value}
                    </span>
                    <span className="ml-2 font-mono text-label-xs text-ink-faint">
                      {slo.note}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Observability
