'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Motion primitives shared by DOM and canvas.
 *
 * `prefers-reduced-motion` is honoured here rather than only in CSS, because
 * the things most likely to make someone ill on this site — camera parallax,
 * auto-rotating geometry, scroll-scrubbed dollies — are all driven from JS
 * inside a requestAnimationFrame loop that a media query cannot touch.
 */

/* ─────────────────────────────────────────────────────── reduced motion ── */

/**
 * Returns true when the user has asked for reduced motion.
 *
 * Starts `false` on the server and flips on mount. Callers must treat this as
 * "reduce motion once known" — never gate the initial render on it, or the
 * whole page waits a frame for a media query.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/* ─────────────────────────────────────────────────────────────── pointer ── */

export type Vec2 = { x: number; y: number }

/**
 * Normalised pointer position in [-1, 1], damped toward the real cursor.
 *
 * Returns a ref, not state — this updates every frame and rendering React on
 * each pointermove would cost more than the entire 3D scene. Read
 * `pointer.current.x` inside a useFrame callback.
 *
 * Yields a static { x: 0, y: 0 } under reduced motion or on touch devices,
 * so callers need no branch of their own.
 */
export function usePointerParallax(damping = 0.08) {
  const pointer = useRef<Vec2>({ x: 0, y: 0 })
  const target = useRef<Vec2>({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      pointer.current = { x: 0, y: 0 }
      target.current = { x: 0, y: 0 }
      return
    }
    // Touch devices have no hover position to track; a tap would teleport the
    // camera, which reads as a glitch rather than parallax.
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (event: PointerEvent) => {
      target.current.x = (event.clientX / window.innerWidth) * 2 - 1
      target.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    // Recentre when the cursor leaves — otherwise the camera stays cocked at
    // whatever angle the pointer had when it exited the viewport.
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    let raf = 0
    const damp = () => {
      pointer.current.x += (target.current.x - pointer.current.x) * damping
      pointer.current.y += (target.current.y - pointer.current.y) * damping
      raf = requestAnimationFrame(damp)
    }
    raf = requestAnimationFrame(damp)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [damping, reduced])

  return pointer
}

/* ──────────────────────────────────────────────────────────── typewriter ── */

type TypewriterOptions = {
  /** ms per character. */
  speed?: number
  /** ms to wait before the first character. */
  delay?: number
  /** Don't start until this is true — used to wait for the preloader. */
  start?: boolean
}

/**
 * Types `text` out one character at a time.
 *
 * Under reduced motion the full string is returned immediately: the
 * information matters, the animation does not.
 */
export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const { speed = 42, delay = 0, start = true } = options
  const reduced = useReducedMotion()
  const [output, setOutput] = useState('')

  useEffect(() => {
    if (!start) return

    if (reduced) {
      setOutput(text)
      return
    }

    setOutput('')
    let index = 0
    let interval: ReturnType<typeof setInterval>

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index++
        setOutput(text.slice(0, index))
        if (index >= text.length) clearInterval(interval)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, delay, start, reduced])

  return { text: output, done: output.length >= text.length }
}

/* ──────────────────────────────────────────────────────────────── counter ── */

/** Eases a number from 0 to `to` once `active` turns true. */
export function useCountUp(to: number, { duration = 1200, active = true } = {}) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    if (reduced || duration <= 0) {
      setValue(to)
      return
    }

    let raf = 0
    const started = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1)
      // easeOutExpo — fast arrival, long settle. Matches ease.out in tokens.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(to * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration, active, reduced])

  return value
}

/* ───────────────────────────────────────────────────────────── in view ── */

/** Fires once when the element scrolls into view. Used to defer canvas mounts. */
export function useInView<T extends Element>(
  { rootMargin = '200px', once = true } = {},
) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, once])

  return [ref, inView] as const
}
