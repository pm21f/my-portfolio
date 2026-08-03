'use client'

import { experience } from '@/config/experience'

/** The spine as a plain CSS rail. */
export function ExperienceFallback({ active }: { active: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <ol className="relative flex h-2/3 flex-col justify-between">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-line-subtle"
        />
        {experience.map((role, index) => (
          <li key={role.id} className="relative flex justify-center">
            <span
              aria-hidden="true"
              className="block rounded-full"
              style={{
                width: index === active ? 14 : 8,
                height: index === active ? 14 : 8,
                background:
                  role.status === 'current' ? 'var(--signal-ok)' : 'var(--accent)',
                opacity: index === active ? 1 : 0.35,
                boxShadow: index === active ? '0 0 14px var(--accent-glow)' : 'none',
                transition: 'all 320ms var(--ease-out)',
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ExperienceFallback
