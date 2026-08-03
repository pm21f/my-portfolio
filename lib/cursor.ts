'use client'

import { useSyncExternalStore } from 'react'

/**
 * Custom-cursor state.
 *
 * A module store rather than context because the things that change the cursor
 * are mostly INSIDE a <Canvas> — three.js pointer handlers on meshes — while
 * the cursor itself is a DOM element outside it. React context doesn't cross
 * that boundary cleanly, and a plain subscribe/emit does.
 */

export type CursorMode =
  | 'default'
  /** Over something clickable — ring expands, dot shrinks. */
  | 'hover'
  /** Over something draggable, like the skills sphere. */
  | 'drag'
  /** Over text input — the ring becomes a caret bar. */
  | 'text'
  /** Hidden, e.g. while the preloader is up. */
  | 'hidden'

export type CursorSnapshot = { mode: CursorMode; label: string }

let mode: CursorMode = 'default'
let label = ''
const listeners = new Set<() => void>()
// Annotated, not inferred — inference would narrow `mode` to the literal
// 'default' from the initialiser and reject every other mode on assignment.
let snapshot: CursorSnapshot = { mode, label }

function emit() {
  // A NEW object each change — useSyncExternalStore compares by identity and
  // would skip the update if we mutated in place.
  snapshot = { mode, label }
  listeners.forEach((listener) => listener())
}

export function setCursor(next: CursorMode, nextLabel = '') {
  if (mode === next && label === nextLabel) return
  mode = next
  label = nextLabel
  emit()
}

/** Convenience for mesh pointer handlers: `{...cursorHandlers('hover', 'inspect')}`. */
export function cursorHandlers(next: CursorMode = 'hover', nextLabel = '') {
  return {
    onPointerOver: () => setCursor(next, nextLabel),
    onPointerOut: () => setCursor('default'),
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const serverSnapshot: CursorSnapshot = { mode: 'default', label: '' }

export function useCursorState() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  )
}
