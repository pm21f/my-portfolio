'use client'

import { useRef, useState } from 'react'
import { useSound } from '@/lib/audio'
import { setCursor } from '@/lib/cursor'
import { useReducedMotion } from '@/lib/motion'
import type { Project } from '@/config/projects'
import ArchitectureDiagram from './ArchitectureDiagram'

/**
 * A project card that tilts toward the pointer and expands into a case study.
 *
 * The tilt is a CSS 3D transform, not WebGL, and that is a considered choice
 * rather than a shortcut. A case study is dense text — headings, prose, a
 * diagram, metrics — and text inside a canvas is unselectable, unsearchable,
 * invisible to a screen reader, and soft on a retina display. Meanwhile the
 * page already runs five WebGL scenes; a sixth for what is fundamentally a
 * document would spend frame budget to make the content worse.
 *
 * So: real perspective, real depth, real DOM.
 */
export function ProjectCard({
  project,
  expanded,
  onToggle,
  dimmed,
}: {
  project: Project
  expanded: boolean
  onToggle: () => void
  dimmed: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  const { play } = useSound()

  const panelId = `case-study-${project.slug}`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Tilting a card that's currently reading as a document would make the text
    // wobble under the cursor.
    if (reduced || expanded) return
    const element = cardRef.current
    if (!element) return

    const bounds = element.getBoundingClientRect()
    const px = (event.clientX - bounds.left) / bounds.width - 0.5
    const py = (event.clientY - bounds.top) / bounds.height - 0.5
    // Small angles. Past ~8° the perspective distortion starts to look like a
    // bug rather than a lift.
    setTilt({ x: -py * 7, y: px * 7 })
  }

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 })
    setCursor('default')
  }

  return (
    <li
      style={{
        opacity: dimmed ? 0.35 : 1,
        transition: 'opacity 320ms var(--ease-out)',
        // Perspective on the parent, not the card — otherwise each card gets
        // its own vanishing point and they don't read as sharing a space.
        perspective: '1200px',
      }}
    >
      <div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerEnter={() => setCursor('hover')}
        onPointerLeave={resetTilt}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 320ms var(--ease-out)',
        }}
        className="glass rounded-xl"
      >
        <div className="p-6 lg:p-8">
          <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span
              aria-hidden="true"
              className="font-display text-display-md font-bold text-ink-faint"
            >
              {project.index}
            </span>

            <h3 className="font-display text-display-md font-bold text-ink">{project.name}</h3>

            <span className="rounded border border-line px-2 py-0.5 font-mono text-label-xs uppercase text-accent">
              {project.kind}
            </span>

            <span className="ml-auto flex items-center gap-2 font-mono text-label-xs uppercase text-signal-ok">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal-ok"
              />
              {project.status}
            </span>
          </div>

          <p className="mb-6 max-w-2xl font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
            {project.summary}
          </p>

          {/* outcome metrics — the part a hiring manager actually scans */}
          <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-4">
            {project.outcome.map((metric) => (
              <div key={metric.label}>
                <dt className="font-mono text-label-xs uppercase text-ink-muted">
                  {metric.label}
                </dt>
                <dd className="font-display text-display-md font-bold text-accent">
                  {metric.value}
                </dd>
                <dd className="mt-0.5 font-mono text-label-xs text-ink-faint">{metric.note}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                play('click')
                setTilt({ x: 0, y: 0 })
                onToggle()
              }}
              aria-expanded={expanded}
              aria-controls={panelId}
              className="rounded-md border border-line px-4 py-2 font-mono text-label-sm uppercase text-ink-secondary transition-all duration-fast hover:border-accent hover:text-accent"
            >
              {expanded ? 'collapse case study' : 'read case study'}
            </button>

            {project.links.source ? (
              <a
                href={project.links.source}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => setCursor('hover')}
                onPointerLeave={() => setCursor('default')}
                className="font-mono text-label-sm uppercase text-ink-muted transition-colors duration-fast hover:text-accent"
              >
                source ↗
              </a>
            ) : null}

            {project.needsReview ? (
              // Visible on purpose. Draft prose should be obvious to whoever
              // owns the site, not buried in a code comment.
              <span
                className="rounded border border-dashed px-2 py-0.5 font-mono text-label-xs uppercase"
                style={{ borderColor: 'var(--signal-warn)', color: 'var(--signal-warn)' }}
                title="The problem statement and architecture on this card are drafted and need your review."
              >
                draft copy
              </span>
            ) : null}
          </div>
        </div>

        {/*
          The case study stays MOUNTED when collapsed, hidden with the `hidden`
          attribute. That keeps every word in the server-rendered HTML — the
          case studies are the most substantial content on this site and
          conditionally rendering them would hide them from crawlers entirely.
        */}
        <div
          id={panelId}
          hidden={!expanded}
          className="border-t border-line-subtle px-6 pb-8 pt-6 lg:px-8"
        >
          <h4 className="mb-2 font-mono text-label-md uppercase text-accent">The problem</h4>
          <p className="mb-6 max-w-2xl font-mono text-body-sm leading-relaxed text-ink-secondary text-pretty">
            {project.problem}
          </p>

          <h4 className="mb-2 font-mono text-label-md uppercase text-accent">Architecture</h4>
          <ArchitectureDiagram project={project} />

          <h4 className="mb-3 mt-6 font-mono text-label-md uppercase text-accent">Stack</h4>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded border border-line-subtle px-2.5 py-1 font-mono text-label-xs text-ink-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

export default ProjectCard
