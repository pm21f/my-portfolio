'use client'

import { skillsByCategory } from '@/config/skills'

/**
 * Skills without WebGL — the same list, grouped, as chips.
 *
 * Interactive in exactly the same way: a chip selects, a second press clears.
 * The sphere is a nicer object to look at; this is arguably a faster way to
 * find a specific technology.
 */
export function SkillsFallback({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="absolute inset-0 overflow-y-auto px-1 py-2">
      <div className="space-y-6">
        {skillsByCategory().map((group) => (
          <div key={group.key}>
            <p className="mb-2 font-mono text-label-xs uppercase text-ink-muted">
              <span className="text-accent">{group.index}</span> {group.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((skill) => {
                const isSelected = selected === skill.id
                const hasProjects = skill.projects.length > 0
                return (
                  <li key={skill.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(skill.id)}
                      disabled={!hasProjects}
                      aria-pressed={isSelected}
                      className="rounded border px-2.5 py-1 font-mono text-label-sm transition-all duration-fast disabled:cursor-default"
                      style={{
                        borderColor: isSelected ? 'var(--accent)' : 'var(--line-subtle)',
                        color: isSelected
                          ? 'var(--accent)'
                          : hasProjects
                            ? 'var(--text-secondary)'
                            : 'var(--text-faint)',
                        background: isSelected ? 'var(--accent-dim)' : 'transparent',
                      }}
                    >
                      {skill.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsFallback
