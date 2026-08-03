'use client'

import { createContext, createElement, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './motion'

/**
 * Scroll is the site's only navigation. Everything else — camera dollies,
 * pipeline packets, timeline reveals — reads from it.
 *
 * Three pieces have to agree on a single clock or the page judders:
 *
 *   Lenis          smooths the wheel/touch delta and sets scroll position
 *   ScrollTrigger  computes per-section progress
 *   GSAP ticker    drives both from ONE rAF loop
 *
 * The common bug is letting Lenis run its own rAF while ScrollTrigger runs
 * another: they sample the same scroll value one frame apart, and every
 * scrubbed animation shimmers. Hence the ticker wiring in SmoothScrollProvider.
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ─────────────────────────────────────────────────────────────── instance ── */

let lenisInstance: Lenis | null = null

/** The live Lenis instance, or null when smoothing is off (reduced motion). */
export function getLenis(): Lenis | null {
  return lenisInstance
}

/**
 * Scroll to a section by id. Falls back to native scrolling when Lenis is off,
 * so keyboard and reduced-motion users still get working nav links.
 */
export function scrollToSection(id: string, offset = 0) {
  const target = document.getElementById(id)
  if (!target) return

  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset, duration: 1.4 })
  } else {
    // 'auto' not 'smooth' — this path exists *because* motion is unwanted.
    target.scrollIntoView({ behavior: 'auto', block: 'start' })
  }
}

/* ─────────────────────────────────────────────────────────────── provider ── */

const ScrollContext = createContext<{ ready: boolean }>({ ready: false })

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Reduced motion gets the browser's native scroll: instant, predictable,
    // no interpolation. ScrollTrigger still works — it just reads real scroll.
    if (reduced) {
      setReady(true)
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      // expo-out: catches up quickly, settles slowly. Same curve as ease.out.
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch smoothing is left OFF deliberately — overriding native momentum
      // on mobile makes scrolling feel laggy and detached from the finger.
      syncTouch: false,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const drive = (time: number) => lenis.raf(time * 1000) // gsap ticker is in seconds
    gsap.ticker.add(drive)
    // Without this, GSAP "helpfully" clamps delta after a slow frame and the
    // scrub falls behind the actual scroll position.
    gsap.ticker.lagSmoothing(0)

    setReady(true)

    return () => {
      gsap.ticker.remove(drive)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])

  // Fonts and images landing late change layout height, which invalidates every
  // trigger's start/end. Recalculate once everything has settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => {})
    return () => window.removeEventListener('load', refresh)
  }, [])

  return createElement(ScrollContext.Provider, { value: { ready } }, children)
}

export function useScrollReady() {
  return useContext(ScrollContext).ready
}

/* ───────────────────────────────────────────────────────────── progress ── */

type ProgressOptions = {
  /** ScrollTrigger start, e.g. 'top bottom'. */
  start?: string
  /** ScrollTrigger end, e.g. 'bottom top'. */
  end?: string
  /**
   * Called on every scroll update with progress in [0, 1].
   *
   * Runs on the scroll thread — do NOT setState unconditionally here. Derive a
   * coarse value (an index, a bucket) and only set state when it changes, or
   * you re-render the tree on every frame of the scroll.
   */
  onUpdate?: (progress: number) => void
}

/**
 * Section scroll progress as a REF in [0, 1].
 *
 * A ref, not state: this changes every frame during a scroll, and re-rendering
 * a React tree that owns a WebGL canvas 60 times a second is exactly the thing
 * that breaks the frame budget. Read `progress.current` inside useFrame.
 */
export function useScrollProgress<T extends HTMLElement>(
  { start = 'top bottom', end = 'bottom top', onUpdate }: ProgressOptions = {},
) {
  const ref = useRef<T>(null)
  const progress = useRef(0)

  // Kept in a ref so a caller passing an inline arrow doesn't tear down and
  // rebuild the ScrollTrigger on every render.
  const callback = useRef(onUpdate)
  callback.current = onUpdate

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      onUpdate: (self) => {
        progress.current = self.progress
        callback.current?.(self.progress)
      },
    })

    // Seed the value — a section already on-screen at load would otherwise sit
    // at 0 until the user's first scroll event.
    progress.current = trigger.progress

    return () => trigger.kill()
  }, [start, end])

  return [ref, progress] as const
}

/**
 * Which section id is currently occupying the viewport.
 *
 * This one IS state — it changes a handful of times per page, drives the nav's
 * active marker, and re-rendering on it is cheap.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const triggers = ids.map((id) => {
      const element = document.getElementById(id)
      if (!element) return null

      return ScrollTrigger.create({
        trigger: element,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) setActive(id)
        },
      })
    })

    return () => triggers.forEach((trigger) => trigger?.kill())
  }, [ids])

  return active
}

export { ScrollTrigger, gsap }
