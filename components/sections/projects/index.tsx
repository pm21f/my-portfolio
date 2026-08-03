'use client'

import { useState } from 'react'
import SectionHeader from '@/components/shell/SectionHeader'
import { clearSkill, useFilteredProjects } from '@/lib/filter'
import { useSound } from '@/lib/audio'
import { projects } from '@/config/projects'
import ProjectCard from './ProjectCard'

/**
 * PROJECTS — section 05.
 *
 * Reads the skill filter set in the Skills section. Filtered-out projects are
 * dimmed rather than removed: keeping them in the DOM means the list never
 * jumps, the page height stays stable (so ScrollTrigger doesn't need a
 * refresh), and every case study remains in the HTML regardless of filter.
 */
export function Projects() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const filter = useFilteredProjects()
  const { play } = useSound()

  return (
    <section id="projects" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader index="05" label="Work">
          Four systems, and what they <span className="text-accent-gradient">changed</span>.
        </SectionHeader>

        <div className="mb-14 mt-6 flex flex-wrap items-center gap-4">
          <p className="max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
            What each system runs on, and the numbers it moved. Select a technology above
            to narrow this list to where I used it.
          </p>

          {filter ? (
            <button
              type="button"
              onClick={() => {
                play('click')
                clearSkill()
              }}
              className="rounded border border-accent px-3 py-1 font-mono text-label-xs uppercase text-accent transition-colors duration-fast hover:bg-accent-dim"
            >
              {filter.skillLabel} ✕
            </button>
          ) : null}
        </div>

        <ul className="space-y-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              expanded={expanded === project.slug}
              dimmed={filter ? !filter.slugs.includes(project.slug) : false}
              onToggle={() =>
                setExpanded((current) => (current === project.slug ? null : project.slug))
              }
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Projects
