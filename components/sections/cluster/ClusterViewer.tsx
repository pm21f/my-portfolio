'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import SceneGate from '@/components/three/SceneGate'
import { useSound } from '@/lib/audio'
import { setCursor } from '@/lib/cursor'
import { controlPlane, maxPodsPerNode, scaleStep, workers } from '@/config/cluster'
import type { PodInstance } from './ClusterScene'
import ClusterFallback from './Fallback'

const ClusterCanvas = dynamic(() => import('./ClusterCanvas'), { ssr: false })

/** Deterministic starting layout — same on the server and the client. */
function initialPods(): PodInstance[] {
  const pods: PodInstance[] = []
  let id = 0
  workers.forEach((worker, workerIndex) => {
    for (let slot = 0; slot < worker.pods; slot++) {
      pods.push({ id: id++, worker: workerIndex, slot })
    }
  })
  return pods
}

/**
 * The cluster section's interactive shell.
 *
 * Every control here is a real DOM <button>, not a click target inside the
 * canvas. That's what makes "scale up" reachable by keyboard and announceable
 * by a screen reader — the 3D is the visualisation, the DOM is the interface.
 *
 * Hover is bidirectional: pointing at a node in the scene highlights its row in
 * the table, and focusing a row highlights the node. Neither view is the
 * primary one.
 */
export function ClusterViewer() {
  const [pods, setPods] = useState<PodInstance[]>(initialPods)
  const [hovered, setHovered] = useState<number | null>(null)
  const { play } = useSound()

  const perWorker = useMemo(() => {
    const counts = workers.map(() => 0)
    pods.forEach((pod) => {
      counts[pod.worker] = (counts[pod.worker] ?? 0) + 1
    })
    return counts
  }, [pods])

  const atCapacity = perWorker.every((count) => count >= maxPodsPerNode)

  const scaleUp = useCallback(() => {
    play('confirm')
    setPods((current) => {
      const counts = workers.map(() => 0)
      current.forEach((pod) => {
        counts[pod.worker] += 1
      })

      const next = [...current]
      let nextId = current.reduce((max, pod) => Math.max(max, pod.id), 0) + 1

      for (let added = 0; added < scaleStep; added++) {
        // Least-loaded placement — the same rule the real scheduler applies
        // when nothing else constrains where a pod can go.
        let target = -1
        let lowest = Infinity
        counts.forEach((count, index) => {
          if (count < lowest && count < maxPodsPerNode) {
            lowest = count
            target = index
          }
        })
        if (target === -1) break

        next.push({ id: nextId++, worker: target, slot: counts[target] })
        counts[target] += 1
      }
      return next
    })
  }, [play])

  const reset = useCallback(() => {
    play('click')
    setPods(initialPods())
  }, [play])

  const totalPods = pods.length

  return (
    <div className="relative">
      <div className="relative h-[70svh] min-h-[420px] w-full">
        <SceneGate fallback={<ClusterFallback perWorker={perWorker} hovered={hovered} />}>
          <ClusterCanvas pods={pods} hovered={hovered} onHover={setHovered} />
        </SceneGate>
      </div>

      {/* ── controls ── */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={scaleUp}
          disabled={atCapacity}
          onPointerEnter={() => {
            setCursor('hover')
            play('hover')
          }}
          onPointerLeave={() => setCursor('default')}
          className="rounded-md bg-accent px-5 py-2.5 font-mono text-label-md font-semibold uppercase text-void transition-all duration-fast hover:bg-accent-hot hover:shadow-glow disabled:cursor-not-allowed disabled:bg-ink-faint disabled:text-ink-muted disabled:shadow-none"
        >
          kubectl scale +{scaleStep}
        </button>

        <button
          type="button"
          onClick={reset}
          onPointerEnter={() => setCursor('hover')}
          onPointerLeave={() => setCursor('default')}
          className="rounded-md border border-line px-5 py-2.5 font-mono text-label-md uppercase text-ink-secondary transition-all duration-fast hover:border-accent hover:text-accent"
        >
          reset
        </button>

        {/*
          aria-live so the pod count is announced when it changes. Without it a
          screen-reader user presses "scale up" and gets no feedback at all —
          the entire result of the action is a visual one inside a canvas.
        */}
        <p aria-live="polite" className="font-mono text-label-sm uppercase text-ink-muted">
          <span className="text-signal-ok">{totalPods}</span> pods scheduled across{' '}
          {workers.length} nodes
          {atCapacity ? ' — all nodes at capacity' : ''}
        </p>
      </div>

      {/* ── the same data as text ── */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <h3 className="mb-2 font-mono text-label-md uppercase text-accent">
            {controlPlane.role}
          </h3>
          <p className="mb-3 font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
            {controlPlane.detail}
          </p>
          <ul className="flex flex-wrap gap-2">
            {controlPlane.components.map((component) => (
              <li
                key={component}
                className="rounded border border-line-subtle px-2 py-0.5 font-mono text-label-xs text-ink-muted"
              >
                {component}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <caption className="sr-only">
              Worker nodes in the demonstration cluster and their scheduled pod counts
            </caption>
            <thead>
              <tr className="border-b border-line-subtle">
                {['Node', 'Zone', 'CPU', 'Memory', 'Pods'].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="py-2 font-mono text-label-xs uppercase text-ink-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workers.map((worker, index) => (
                <tr
                  key={worker.id}
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  className="border-b border-line-subtle transition-colors duration-fast"
                  style={{
                    background: hovered === index ? 'var(--accent-dim)' : 'transparent',
                  }}
                >
                  <td className="py-2 font-mono text-label-sm text-ink">{worker.id}</td>
                  <td className="py-2 font-mono text-label-sm text-ink-muted">{worker.zone}</td>
                  <td className="py-2 font-mono text-label-sm text-ink-muted">{worker.cpu}</td>
                  <td className="py-2 font-mono text-label-sm text-ink-muted">{worker.memory}</td>
                  <td className="py-2 font-mono text-label-sm text-signal-ok">
                    {perWorker[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ClusterViewer
