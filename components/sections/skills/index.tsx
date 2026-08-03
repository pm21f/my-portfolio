import SectionHeader from '@/components/shell/SectionHeader'
import { skillsByCategory } from '@/config/skills'
import SkillsViewer from './SkillsViewer'

/**
 * SKILLS — section 03.
 *
 * The full categorised list is rendered here, in the server component, as
 * plain semantic markup. The sphere is a second view of that same list — if the
 * canvas never loads, nothing is lost but the spectacle.
 */
export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" label="Stack">
          The tools I reach for, <span className="text-accent-gradient">and why</span>.
        </SectionHeader>

        <p className="mb-14 mt-6 max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
          Drag to rotate. Select a technology to filter the work below to the projects
          where I actually used it in production.
        </p>

        <SkillsViewer />

        {/* The canonical, always-present list. */}
        <div className="mt-16 grid gap-10 border-t border-line-subtle pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {skillsByCategory().map((group) => (
            <div key={group.key}>
              <h3 className="mb-3 font-mono text-label-md uppercase text-ink-secondary">
                <span className="text-accent">{group.index}</span> {group.label}
              </h3>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
                {group.items.map((skill) => (
                  <li key={skill.id} className="font-mono text-label-sm text-ink-muted">
                    {skill.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
