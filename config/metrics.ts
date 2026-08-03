/**
 * Telemetry panel definitions for the observability section.
 *
 * ── HONESTY NOTE ────────────────────────────────────────────────────────────
 * These values are SIMULATED. They are shaped to be plausible for the kind of
 * infrastructure described elsewhere on the site, but nothing here is scraped
 * from a live Prometheus. The section labels them as simulated in the UI, and
 * it should stay that way — a portfolio that displays invented numbers as
 * though they were real production telemetry is misrepresenting itself.
 *
 * If you later wire this to a real endpoint, drop the label along with the
 * generator in MetricsWall.
 */

export type MetricPanel = {
  id: string
  label: string
  unit: string
  /** Centre of the simulated range. */
  baseline: number
  /** Peak-to-peak wander around the baseline. */
  variance: number
  /** Decimal places when displayed. */
  precision: number
  /** Lower is better — flips the trend colour. */
  inverse?: boolean
}

export const panels: MetricPanel[] = [
  { id: 'latency-p99', label: 'p99 latency', unit: 'ms', baseline: 184, variance: 46, precision: 0, inverse: true },
  { id: 'latency-p50', label: 'p50 latency', unit: 'ms', baseline: 38, variance: 9, precision: 0, inverse: true },
  { id: 'throughput', label: 'Throughput', unit: 'req/s', baseline: 2450, variance: 620, precision: 0 },
  { id: 'error-rate', label: 'Error rate', unit: '%', baseline: 0.04, variance: 0.03, precision: 2, inverse: true },
  { id: 'cpu', label: 'Cluster CPU', unit: '%', baseline: 47, variance: 18, precision: 0, inverse: true },
  { id: 'saturation', label: 'Memory', unit: '%', baseline: 61, variance: 12, precision: 0, inverse: true },
]

/** Steady figures shown as headline stats rather than live series. */
export const slos = [
  { label: 'Uptime', value: '99.98%', note: 'rolling 90 days' },
  { label: 'Error budget', value: '31%', note: 'consumed this quarter' },
  { label: 'MTTR', value: '11 min', note: 'median, last 20 incidents' },
  { label: 'Alert rules', value: '80+', note: 'routed by severity' },
]

/**
 * Deterministic pseudo-noise in [0, 1].
 *
 * Layered sines rather than Math.random(): the series has to be reproducible so
 * the 3D bars and the DOM readouts show the SAME value at the same moment. Two
 * independent random walks would visibly disagree.
 */
export function metricNoise(seed: number, time: number): number {
  const a = Math.sin(time * 0.7 + seed * 12.9898)
  const b = Math.sin(time * 1.9 + seed * 78.233) * 0.5
  const c = Math.sin(time * 4.1 + seed * 37.719) * 0.25
  return (a + b + c) / 3.5 / 2 + 0.5
}

export function metricValue(panel: MetricPanel, seed: number, time: number): number {
  return panel.baseline + (metricNoise(seed, time) - 0.5) * panel.variance
}
