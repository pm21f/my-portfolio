'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorState } from '@/lib/cursor'

/**
 * Custom cursor: a hard dot that tracks exactly, and a ring that lags behind.
 *
 * The split is the entire trick. A single lagging cursor feels broken because
 * clicks land where the pointer is, not where the graphic is. Keeping the dot
 * pinned to the true position preserves precision while the ring supplies the
 * character.
 *
 * Never rendered for touch (no persistent pointer to represent) or under
 * reduced motion (a trailing element is exactly the kind of incidental motion
 * that setting asks us to drop). In both cases the OS cursor is left alone.
 */
export function Cursor() {
  const { mode, label } = useCursorState()
  const [active, setActive] = useState(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    setActive(true)
    document.documentElement.style.cursor = 'none'

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...pointer }
    let raf = 0

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      // The dot is written synchronously with the pointer event rather than in
      // the rAF loop — one frame of lag on the dot is visible as sloppiness.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
      }
    }

    const tick = () => {
      ring.x += (pointer.x - ring.x) * 0.18
      ring.y += (pointer.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.style.cursor = ''
    }
  }, [])

  if (!active) return null

  const hidden = mode === 'hidden'
  const isText = mode === 'text'

  const ringSize = mode === 'hover' ? 46 : mode === 'drag' ? 56 : 28
  const dotSize = mode === 'hover' ? 3 : 5

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 60 }}>
      {/* trailing ring — carries the contextual label with it */}
      <div ref={ringRef} className="fixed left-0 top-0">
        <div
          className="border"
          style={{
            width: isText ? 2 : ringSize,
            height: isText ? 22 : ringSize,
            borderRadius: isText ? 1 : 999,
            borderColor: 'var(--accent)',
            background: isText ? 'var(--accent)' : 'transparent',
            opacity: hidden ? 0 : mode === 'default' ? 0.45 : 0.9,
            transition:
              'width 260ms var(--ease-out), height 260ms var(--ease-out), opacity 200ms linear, border-radius 200ms var(--ease-out)',
          }}
        />
        {label && !hidden ? (
          <span
            className="absolute left-1/2 whitespace-nowrap font-mono text-label-xs uppercase text-accent"
            style={{
              top: 'calc(100% + 10px)',
              transform: 'translateX(-50%)',
              letterSpacing: '0.18em',
            }}
          >
            {label}
          </span>
        ) : null}
      </div>

      {/* precise dot */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full"
        style={{
          width: dotSize,
          height: dotSize,
          background: 'var(--accent-hot)',
          opacity: hidden || isText ? 0 : 1,
          transition: 'width 180ms var(--ease-out), height 180ms var(--ease-out), opacity 160ms linear',
        }}
      />
    </div>
  )
}

export default Cursor
