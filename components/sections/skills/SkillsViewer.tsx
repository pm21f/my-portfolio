'use client'

import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import SceneGate from '@/components/three/SceneGate'
import { useSound } from '@/lib/audio'
import { clearSkill, selectSkill, useSelectedSkill } from '@/lib/filter'
import { skills } from '@/config/skills'
import SkillsFallback from './Fallback'

const SkillsCanvas = dynamic(() => import('./SkillsCanvas'), { ssr: false })

/**
 * Owns the selection and hands it to whichever view is active.
 *
 * The selection itself lives in lib/filter's module store, not here — the
 * projects section reads it from far down the page.
 */
export function SkillsViewer() {
  const selected = useSelectedSkill()
  const { play } = useSound()

  const onSelect = useCallback(
    (id: string) => {
      const skill = skills.find((entry) => entry.id === id)
      // Selecting a skill with no linked projects would filter the work list to
      // nothing, which reads as a broken filter rather than an honest gap.
      if (!skill || skill.projects.length === 0) {
        play('error')
        return
      }
      play('click')
      selectSkill(id)
    },
    [play],
  )

  const active = selected ? skills.find((entry) => entry.id === selected) : null

  return (
    <div className="relative">
      <div className="relative h-[62svh] min-h-[380px] w-full">
        <SceneGate fallback={<SkillsFallback selected={selected} onSelect={onSelect} />}>
          <SkillsCanvas selected={selected} onSelect={onSelect} />
        </SceneGate>
      </div>

      {/* Selection status. aria-live because on the 3D path the only other
          feedback is a colour change inside a canvas. */}
      <div aria-live="polite" className="mt-6 flex flex-wrap items-center gap-4">
        {active ? (
          <>
            <p className="font-mono text-label-sm uppercase text-ink-secondary">
              Filtering work by <span className="text-accent">{active.label}</span> —{' '}
              {active.projects.length} project{active.projects.length === 1 ? '' : 's'}
            </p>
            <button
              type="button"
              onClick={() => {
                play('click')
                clearSkill()
              }}
              className="rounded border border-line px-3 py-1 font-mono text-label-xs uppercase text-ink-muted transition-colors duration-fast hover:border-accent hover:text-accent"
            >
              clear filter
            </button>
          </>
        ) : (
          <p className="font-mono text-label-sm uppercase text-ink-faint">
            No filter applied — showing all work
          </p>
        )}
      </div>
    </div>
  )
}

export default SkillsViewer
