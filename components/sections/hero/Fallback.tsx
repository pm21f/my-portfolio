'use client'

import { useMemo } from 'react'

/**
 * The hero without WebGL.
 *
 * Same idea — nodes on a sphere, joined by edges — drawn as a single inline
 * SVG. No canvas, no three.js, no bundle: this path costs about 2KB and runs
 * on a phone from 2017 without dropping a frame.
 *
 * It is not a placeholder or a spinner. Someone on a low-power device should
 * feel they got a different rendering of the same design, not a broken one.
 */

const NODE_COUNT = 44
const VIEWBOX = 400
const CENTER = VIEWBOX / 2
const RADIUS = 150

export function HeroFallback() {
  const { nodes, edges } = useMemo(() => {
    // Same golden-angle distribution as the 3D globe, orthographically
    // projected, so the two versions share a silhouette.
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const points = Array.from({ length: NODE_COUNT }, (_, index) => {
      const y = 1 - (index / (NODE_COUNT - 1)) * 2
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * index
      return {
        x: CENTER + Math.cos(theta) * ringRadius * RADIUS,
        y: CENTER + y * RADIUS,
        // Depth drives opacity and size — the only cue that this is a sphere.
        depth: (Math.sin(theta) * ringRadius + 1) / 2,
      }
    })

    const links: { from: number; to: number }[] = []
    points.forEach((point, index) => {
      let nearest = -1
      let best = Infinity
      points.forEach((other, otherIndex) => {
        if (index === otherIndex) return
        const distance = (point.x - other.x) ** 2 + (point.y - other.y) ** 2
        if (distance < best) {
          best = distance
          nearest = otherIndex
        }
      })
      if (nearest >= 0) links.push({ from: index, to: nearest })
    })

    return { nodes: points, edges: links }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="h-[min(76vh,560px)] w-[min(76vh,560px)] max-w-full"
        aria-hidden="true"
        style={{ animation: 'spin 90s linear infinite' }}
      >
        <g stroke="var(--accent)" strokeWidth="0.5" opacity="0.22">
          {edges.map((edge, index) => (
            <line
              key={index}
              x1={nodes[edge.from].x}
              y1={nodes[edge.from].y}
              x2={nodes[edge.to].x}
              y2={nodes[edge.to].y}
            />
          ))}
        </g>
        <g fill="var(--accent)">
          {nodes.map((node, index) => (
            <circle
              key={index}
              cx={node.x}
              cy={node.y}
              r={1.2 + node.depth * 2}
              opacity={0.3 + node.depth * 0.6}
            />
          ))}
        </g>
      </svg>

      {/* Scoped keyframes — `spin` is not in the Tailwind config. */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          svg {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroFallback
