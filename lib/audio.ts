'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * UI sound.
 *
 * Every sound is SYNTHESISED with oscillators rather than loaded from a file.
 * Three reasons, in order of importance:
 *
 *   1. Zero bytes. No audio asset competes with the 3D scenes for bandwidth
 *      during load, which matters for the LCP budget.
 *   2. Zero latency. A click that plays 80ms after the pointer-down reads as
 *      broken; there is no decode step here.
 *   3. Nothing to license or misplace.
 *
 * Off by default, and it stays off until the user flips the toggle. Autoplaying
 * sound is hostile, and browsers block it anyway.
 */

const STORAGE_KEY = 'pm:sound'

type Voice = 'click' | 'hover' | 'confirm' | 'error' | 'boot'

/* ──────────────────────────────────────────────────────────────── store ── */

let enabled = false
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    // Private browsing / storage disabled — stay silent, which is the default.
  }
}

/* ───────────────────────────────────────────────────────────── synthesis ── */

let context: AudioContext | null = null

/**
 * Lazily create the AudioContext.
 *
 * Must not run before a user gesture: browsers start the context 'suspended'
 * and Safari refuses to resume one created outside a gesture handler. Since
 * the only path here is the sound toggle (a click), that's satisfied.
 */
function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!context) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext
    if (!Ctor) return null
    context = new Ctor()
  }
  if (context.state === 'suspended') void context.resume()
  return context
}

type VoiceSpec = {
  /** Start and end frequency in Hz — a slide reads as more "designed" than a beep. */
  from: number
  to: number
  duration: number
  gain: number
  type: OscillatorType
}

/**
 * Tuned low and short on purpose. These are meant to sit under the interaction,
 * not announce themselves — if you can hum one back, it's too loud.
 */
const VOICES: Record<Voice, VoiceSpec> = {
  hover: { from: 880, to: 1040, duration: 0.045, gain: 0.02, type: 'sine' },
  click: { from: 1200, to: 620, duration: 0.075, gain: 0.05, type: 'triangle' },
  confirm: { from: 660, to: 1320, duration: 0.14, gain: 0.045, type: 'sine' },
  error: { from: 320, to: 180, duration: 0.16, gain: 0.055, type: 'sawtooth' },
  boot: { from: 220, to: 440, duration: 0.09, gain: 0.03, type: 'square' },
}

export function play(voice: Voice) {
  hydrate()
  if (!enabled) return

  const ctx = getContext()
  if (!ctx) return

  const spec = VOICES[voice]
  const now = ctx.currentTime

  const oscillator = ctx.createOscillator()
  const amp = ctx.createGain()

  oscillator.type = spec.type
  oscillator.frequency.setValueAtTime(spec.from, now)
  oscillator.frequency.exponentialRampToValueAtTime(spec.to, now + spec.duration)

  // Exponential ramp to near-silence rather than a hard stop. Cutting a live
  // oscillator to zero produces an audible click on its own.
  amp.gain.setValueAtTime(spec.gain, now)
  amp.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration)

  oscillator.connect(amp).connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + spec.duration)
}

/* ───────────────────────────────────────────────────────────────── hooks ── */

function getSnapshot() {
  hydrate()
  return enabled
}

// The server has no preference to report and sound is off by default there.
function getServerSnapshot() {
  return false
}

export function useSound() {
  const isEnabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    enabled = !enabled
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      // Non-fatal: the setting just won't survive a reload.
    }
    // Confirm audibly at the moment it's switched on, so the toggle proves
    // itself instead of asking the user to hunt for a sound.
    if (enabled) play('confirm')
    emit()
  }, [])

  return { enabled: isEnabled, toggle, play }
}
