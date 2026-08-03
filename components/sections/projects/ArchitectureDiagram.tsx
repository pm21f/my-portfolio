'use client'

import { useId, useMemo } from 'react'
import type { ArchNode, Project } from '@/config/projects'

/**
 * The architecture diagram, laid out from data.
 *
 * `config/projects.ts` describes each system as nodes with a column index plus
 * a list of edges; this component computes positions and draws it. Nothing is
 * hand-placed, so adding a node to a project's graph reflows the diagram
 * instead of breaking it.
 *
 * SVG rather than WebGL: it's a schematic, it must be legible at a glance, and
 * it should print, scale and survive a screenshot. That's an SVG's job.
 */

const COLUMN_WIDTH = 150
const ROW_HEIGHT = 62
const NODE_WIDTH = 116
const NODE_HEIGHT = 34
const PADDING = 16

/** Signal colour per node role — the one place non-accent colour is allowed. */
const KIND_COLOR: Record<ArchNode['kind'], string> = {
  source: 'var(--text-secondary)',
  compute: 'var(--accent)',
  data: 'var(--accent-deep)',
  observe: 'var(--signal-warn)',
  edge: 'var(--signal-ok)',
}

export function ArchitectureDiagram({ project }: { project: Project }) {
  // Unique per instance: multiple diagrams on one page would otherwise share
  // marker ids and all arrowheads would resolve to the first definition.
  const markerId = useId().replace(/:/g, '')

  const { positions, width, height, columns } = useMemo(() => {
    const byColumn = new Map<number, ArchNode[]>()
    project.architecture.nodes.forEach((node) => {
      const list = byColumn.get(node.column) ?? []
      list.push(node)
      byColumn.set(node.column, list)
    })

    const columnCount = Math.max(...project.architecture.nodes.map((node) => node.column)) + 1
    const tallest = Math.max(...[...byColumn.values()].map((list) => list.length))

    const map = new Map<string, { x: number; y: number }>()
    byColumn.forEach((list, column) => {
      // Centre each column vertically against the tallest one.
      const offset = ((tallest - list.length) * ROW_HEIGHT) / 2
      list.forEach((node, index) => {
        map.set(node.id, {
          x: PADDING + column * COLUMN_WIDTH,
          y: PADDING + offset + index * ROW_HEIGHT,
        })
      })
    })

    return {
      positions: map,
      columns: columnCount,
      width: PADDING * 2 + (columnCount - 1) * COLUMN_WIDTH + NODE_WIDTH,
      height: PADDING * 2 + tallest * ROW_HEIGHT,
    }
  }, [project])

  return (
    <figure className="my-6">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="max-w-full"
          role="img"
          aria-label={`Architecture diagram for ${project.name}. ${describeGraph(project)}`}
        >
          <defs>
            <marker
              id={`arrow-${markerId}`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--line-strong)" />
            </marker>
          </defs>

          {/* edges first, so nodes paint over their endpoints */}
          <g>
            {project.architecture.edges.map(([from, to], index) => {
              const start = positions.get(from)
              const end = positions.get(to)
              if (!start || !end) return null

              const x1 = start.x + NODE_WIDTH
              const y1 = start.y + NODE_HEIGHT / 2
              const x2 = end.x
              const y2 = end.y + NODE_HEIGHT / 2
              // Horizontal-tangent cubic: keeps the line leaving and entering
              // each box squarely, which reads as a wiring diagram rather than
              // a scatter of arcs.
              const midpoint = (x1 + x2) / 2

              return (
                <path
                  key={`${from}-${to}-${index}`}
                  d={`M ${x1} ${y1} C ${midpoint} ${y1}, ${midpoint} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="var(--line-strong)"
                  strokeWidth="1"
                  markerEnd={`url(#arrow-${markerId})`}
                  opacity="0.7"
                />
              )
            })}
          </g>

          <g>
            {project.architecture.nodes.map((node) => {
              const position = positions.get(node.id)
              if (!position) return null
              return (
                <g key={node.id} transform={`translate(${position.x}, ${position.y})`}>
                  <rect
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="5"
                    fill="var(--bg-raised)"
                    stroke={KIND_COLOR[node.kind]}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={NODE_WIDTH / 2}
                    y={NODE_HEIGHT / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--text-primary)"
                    style={{ font: '500 10px var(--font-mono), monospace' }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 border-l-2 border-line pl-4 font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
        {project.architecture.note}
      </figcaption>
    </figure>
  )
}

/** A text description of the graph, for the SVG's accessible name. */
function describeGraph(project: Project): string {
  const labels = new Map(project.architecture.nodes.map((node) => [node.id, node.label]))
  return project.architecture.edges
    .map(([from, to]) => `${labels.get(from) ?? from} flows to ${labels.get(to) ?? to}`)
    .join('. ')
}

export default ArchitectureDiagram
