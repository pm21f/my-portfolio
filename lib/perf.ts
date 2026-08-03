'use client'

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { perf, type Tier } from './tokens'
import { markBooted } from './boot'

/**
 * Device tiering.
 *
 * Two jobs, and they are separate on purpose:
 *
 *   1. Pick a STARTING tier before the first frame, from cheap static signals
 *      (cores, memory, GPU string, save-data). Guessing here is fine — we only
 *      need to avoid opening a 640-node globe on a 2-core phone.
 *
 *   2. DOWNGRADE at runtime when real frames come in slow. This is the one that
 *      actually protects the 60fps budget, because no static signal predicts
 *      thermal throttling or a user with 40 tabs open.
 *
 * Tiers only ever move down, never up. Oscillating between quality levels is
 * more distracting than simply running at the lower one.
 */

export type PerfState = {
  tier: Tier
  /** Budgets for the current tier — node counts, DPR, shadows. */
  budget: (typeof perf)[Tier]
  /** False when the browser cannot give us a WebGL context at all. */
  webgl: boolean
  /** True once detection has run. Scenes render fallbacks until then. */
  ready: boolean
  /** Drop one tier. Called by <Scene>'s frame monitor. Idempotent at 'low'. */
  downgrade: () => void
}

const ORDER: Tier[] = ['high', 'mid', 'low']

const PerfContext = createContext<PerfState | null>(null)

/* ───────────────────────────────────────────────────────────── detection ── */

/**
 * Probe the GPU via WEBGL_debug_renderer_info.
 *
 * The context is explicitly destroyed before returning — browsers cap the
 * number of live WebGL contexts (~16 in Chrome) and silently kill the OLDEST
 * one when you exceed it. On a page with this many canvases, leaking a probe
 * context is how you get a randomly blank hero on the third scroll.
 */
function probeGpu(): { renderer: string; supported: boolean } {
  if (typeof document === 'undefined') return { renderer: '', supported: false }
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return { renderer: '', supported: false }

    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
      : String(gl.getParameter(gl.RENDERER) ?? '')

    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return { renderer: renderer.toLowerCase(), supported: true }
  } catch {
    return { renderer: '', supported: false }
  }
}

/** Software renderers — these cannot hold 60fps on anything, at any size. */
const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render|microsoft basic/

/**
 * Manual override via `?tier=high|mid|low`.
 *
 * Kept in production deliberately: it's the only practical way to see what a
 * low-end device gets without owning one, and to force the full-quality path on
 * a machine (or a headless browser) whose GPU probe would otherwise downgrade
 * it. Read-only and affects nothing but rendering quality.
 */
function tierOverride(): Tier | null {
  if (typeof window === 'undefined') return null
  const requested = new URLSearchParams(window.location.search).get('tier')
  return requested === 'high' || requested === 'mid' || requested === 'low' ? requested : null
}

export function detectTier(): { tier: Tier; webgl: boolean } {
  if (typeof window === 'undefined') return { tier: 'low', webgl: false }

  const { renderer, supported } = probeGpu()

  const override = tierOverride()
  if (override) return { tier: override, webgl: supported }

  if (!supported) return { tier: 'low', webgl: false }
  if (SOFTWARE_GPU.test(renderer)) return { tier: 'low', webgl: true }

  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }

  // Explicit user signal — respect it over any hardware guess.
  if (nav.connection?.saveData) return { tier: 'low', webgl: true }

  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 700

  let score = 0
  score += cores >= 8 ? 2 : cores >= 4 ? 1 : 0
  score += memory >= 8 ? 2 : memory >= 4 ? 1 : 0
  // A touch device on a small viewport is a phone. Phones cap at 'mid'.
  score += coarse && smallViewport ? 0 : 1

  const tier: Tier = score >= 4 ? 'high' : score >= 2 ? 'mid' : 'low'

  // Hard ceiling for phones regardless of reported cores — flagship phone SoCs
  // report 8 cores and still throttle hard after ~30 seconds of sustained GPU.
  if (coarse && smallViewport && tier === 'high') return { tier: 'mid', webgl: true }

  return { tier, webgl: true }
}

/* ────────────────────────────────────────────────────────────── provider ── */

export function PerfProvider({ children }: { children: ReactNode }) {
  // Start at 'low' so the server render and first client paint agree. Anything
  // else hydrates mismatched, and a mismatch inside a Canvas remounts the whole
  // GL context.
  const [tier, setTier] = useState<Tier>('low')
  const [webgl, setWebgl] = useState(false)
  const [ready, setReady] = useState(false)

  /**
   * True when the tier came from `?tier=`, which pins it.
   *
   * Without this the guard fights the override: you force `high` to inspect the
   * full-quality scenes, the machine drops a few frames while shaders compile,
   * and three seconds later you're looking at the low-power fallback wondering
   * why the override "didn't work". An explicit request outranks a heuristic.
   */
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const result = detectTier()
    setTier(result.tier)
    setWebgl(result.webgl)
    setLocked(tierOverride() !== null)
    setReady(true)
    markBooted('device')
  }, [])

  const downgrade = useCallback(() => {
    if (locked) return
    setTier((current) => {
      const next = ORDER[Math.min(ORDER.indexOf(current) + 1, ORDER.length - 1)]
      if (next !== current && process.env.NODE_ENV === 'development') {
        console.info(`[perf] downgrading ${current} → ${next}`)
      }
      return next
    })
  }, [locked])

  const value = useMemo<PerfState>(
    () => ({ tier, budget: perf[tier], webgl, ready, downgrade }),
    [tier, webgl, ready, downgrade],
  )

  return createElement(PerfContext.Provider, { value }, children)
}

export function usePerf(): PerfState {
  const ctx = useContext(PerfContext)
  if (!ctx) {
    throw new Error('usePerf must be used inside <PerfProvider> (see app/layout.tsx)')
  }
  return ctx
}

/**
 * True when this device should get the lightweight 2D fallback instead of a
 * canvas: no WebGL at all, or the lowest tier.
 *
 * Returns false until detection has run so we never flash a fallback at a
 * machine that can handle the real thing.
 */
export function useLightweight(): boolean {
  const { tier, webgl, ready } = usePerf()
  return ready && (!webgl || tier === 'low')
}

/* ──────────────────────────────────────────────────────────── fps guard ── */

/**
 * Watches real frame timing and calls `onSlow` when the device sustains a bad
 * frame rate.
 *
 * Deliberately slow to trigger: it requires `strikes` consecutive bad windows
 * before firing. A single 200ms hitch during scene load is normal and must not
 * cost the user their quality tier.
 */
export function useFpsGuard(
  onSlow: () => void,
  { threshold = 45, windowMs = 1000, strikes = 3, enabled = true } = {},
) {
  const savedCallback = useRef(onSlow)
  savedCallback.current = onSlow

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    let frames = 0
    let strikeCount = 0
    let windowStart = performance.now()
    let raf = 0
    let cancelled = false

    const tick = (now: number) => {
      if (cancelled) return
      frames++
      const elapsed = now - windowStart

      if (elapsed >= windowMs) {
        const fps = (frames * 1000) / elapsed
        strikeCount = fps < threshold ? strikeCount + 1 : 0

        if (strikeCount >= strikes) {
          savedCallback.current()
          return // stop measuring; the tier change remounts what matters
        }
        frames = 0
        windowStart = now
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [threshold, windowMs, strikes, enabled])
}
