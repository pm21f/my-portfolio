'use client'

import { useSound } from '@/lib/audio'
import { setCursor } from '@/lib/cursor'

/**
 * Sound toggle. Off by default and it stays that way until pressed.
 *
 * `aria-pressed` rather than a checkbox role: this is a two-state button, and
 * screen readers announce "sound, toggle button, not pressed" — which is
 * exactly what it is.
 */
export function SoundToggle() {
  const { enabled, toggle, play } = useSound()

  return (
    <button
      type="button"
      onClick={toggle}
      onPointerEnter={() => {
        setCursor('hover')
        play('hover')
      }}
      onPointerLeave={() => setCursor('default')}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn interface sound off' : 'Turn interface sound on'}
      className="group flex items-center gap-2 font-mono text-label-xs uppercase text-ink-muted transition-colors duration-fast hover:text-accent"
    >
      {/* Three bars that stand up when sound is on — legible at 12px, unlike a
          speaker glyph, and it animates as a level meter. */}
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0.45, 1, 0.7].map((height, index) => (
          <span
            key={index}
            className="w-[2px] bg-current"
            style={{
              height: enabled ? `${height * 12}px` : '2px',
              transition: `height 260ms var(--ease-out) ${index * 40}ms`,
            }}
          />
        ))}
      </span>
      <span>{enabled ? 'sound on' : 'sound off'}</span>
    </button>
  )
}

export default SoundToggle
