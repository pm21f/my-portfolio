'use client'

import { useEffect, useSyncExternalStore } from 'react'

/**
 * Boot progress for the preloader.
 *
 * The percentage here is REAL. Every step below resolves from an actual event —
 * a font load, a WebGL probe, the hero's first rendered frame. Nothing is on a
 * timer.
 *
 * That constraint is the whole point. A preloader animating to 100% on a
 * setInterval while the page is still janking is theatre, and it costs the user
 * time rather than saving it. If this bar sits at 60% for a second, something
 * genuinely took a second, and that's worth seeing.
 */

export type BootStep = {
  key: string
  /** Shown in the boot log, in the style of a systemd unit line. */
  label: string
}

export const BOOT_STEPS: BootStep[] = [
  { key: 'dom', label: 'mounting document' },
  { key: 'device', label: 'probing gpu / device tier' },
  { key: 'fonts', label: 'loading typefaces' },
  { key: 'scene', label: 'compiling scene shaders' },
  { key: 'ready', label: 'system ready' },
]

const done = new Set<string>()
const listeners = new Set<() => void>()
let snapshot = { completed: [] as string[], progress: 0 }

function emit() {
  snapshot = {
    completed: [...done],
    progress: done.size / BOOT_STEPS.length,
  }
  listeners.forEach((listener) => listener())
}

/** Mark a boot step complete. Safe to call more than once. */
export function markBooted(key: string) {
  if (done.has(key)) return
  done.add(key)
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const serverSnapshot = { completed: [] as string[], progress: 0 }

export function useBootProgress() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  )
}

/**
 * Drives the steps that aren't owned by a component.
 *
 * `scene` is marked here on a timeout as a FLOOR, not a fake: the hero calls
 * markBooted('scene') from its first rendered frame, but a device with no
 * WebGL never renders one and would otherwise wait forever. Whichever happens
 * first wins.
 */
export function useBootSequence() {
  useEffect(() => {
    markBooted('dom')

    // Fonts: document.fonts.ready resolves once every @font-face used on the
    // page has loaded or failed. next/font preloads them, so this is quick.
    if (document.fonts) {
      document.fonts.ready.then(() => markBooted('fonts')).catch(() => markBooted('fonts'))
    } else {
      markBooted('fonts')
    }

    const sceneFloor = setTimeout(() => markBooted('scene'), 2500)
    const readyFloor = setTimeout(() => markBooted('ready'), 3200)

    return () => {
      clearTimeout(sceneFloor)
      clearTimeout(readyFloor)
    }
  }, [])
}
