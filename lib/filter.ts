'use client'

import { useSyncExternalStore } from 'react'
import type { ProjectSlug } from '@/config/projects'
import { skills } from '@/config/skills'

/**
 * The skill → project filter.
 *
 * Lives in a module store rather than React context because the two ends are
 * far apart in the tree — the selection is made inside a <Canvas> in the skills
 * section, and consumed by the projects section several hundred vh down the
 * page. Threading a provider around both would mean hoisting state to the page
 * root and re-rendering everything between them on each click.
 */

let selected: string | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function selectSkill(id: string | null) {
  // Clicking the active skill clears it — otherwise there's no way back to the
  // full list without hunting for a reset control.
  selected = selected === id ? null : id
  emit()
}

export function clearSkill() {
  if (selected === null) return
  selected = null
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useSelectedSkill(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => selected,
    () => null,
  )
}

/** Projects tagged with the current skill, or null when nothing is selected. */
export function useFilteredProjects(): { skillLabel: string; slugs: ProjectSlug[] } | null {
  const id = useSelectedSkill()
  if (!id) return null

  const skill = skills.find((entry) => entry.id === id)
  if (!skill) return null

  return { skillLabel: skill.label, slugs: [...skill.projects] }
}
