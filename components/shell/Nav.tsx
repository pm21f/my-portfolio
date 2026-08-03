'use client'

import { useMemo } from 'react'
import { sections, site } from '@/config/site'
import { scrollToSection, useActiveSection } from '@/lib/scroll'
import { setCursor } from '@/lib/cursor'
import { useSound } from '@/lib/audio'
import SoundToggle from './SoundToggle'

/**
 * Fixed nav rail.
 *
 * These are real <a href="#id"> anchors, not buttons with scroll handlers. If
 * JavaScript fails, or someone opens the page in a reader, the links still
 * navigate — the click handler only upgrades the jump to a smooth Lenis scroll.
 */
export function Nav() {
  const ids = useMemo(() => sections.map((section) => section.id), [])
  const active = useActiveSection(ids)
  const { play } = useSound()

  return (
    <>
      {/* Wordmark */}
      <a
        href="#hero"
        className="fixed left-6 top-6 font-mono text-label-md uppercase text-ink-secondary transition-colors duration-fast hover:text-accent"
        style={{ zIndex: 40 }}
        onPointerEnter={() => setCursor('hover')}
        onPointerLeave={() => setCursor('default')}
        onClick={(event) => {
          event.preventDefault()
          play('click')
          scrollToSection('hero')
        }}
      >
        {site.name.split(' ')[0]}
        <span className="text-accent">.</span>
      </a>

      {/*
        Section rail. Hidden below lg — on a phone this would eat a third of the
        viewport, and the whole site is a single scroll anyway.
      */}
      <nav
        aria-label="Sections"
        className="fixed right-6 top-1/2 hidden -translate-y-1/2 lg:block"
        style={{ zIndex: 40 }}
      >
        <ul className="flex flex-col items-end gap-3">
          {sections.map((section) => {
            const isActive = active === section.id
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center justify-end gap-3 font-mono text-label-xs uppercase"
                  style={{
                    color: isActive ? 'var(--accent)' : 'var(--text-faint)',
                    transition: 'color 300ms var(--ease-out)',
                  }}
                  onPointerEnter={() => {
                    setCursor('hover')
                    play('hover')
                  }}
                  onPointerLeave={() => setCursor('default')}
                  onClick={(event) => {
                    event.preventDefault()
                    play('click')
                    scrollToSection(section.id)
                  }}
                >
                  <span className="opacity-0 transition-opacity duration-fast group-hover:opacity-100">
                    {section.label}
                  </span>
                  {/* The rule itself is the indicator — it extends when active. */}
                  <span
                    aria-hidden="true"
                    className="block h-px bg-current"
                    style={{
                      width: isActive ? 28 : 12,
                      transition: 'width 320ms var(--ease-out)',
                    }}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Utility corner */}
      <div className="fixed bottom-6 left-6 flex items-center gap-5" style={{ zIndex: 40 }}>
        <SoundToggle />
      </div>

      {/* Scroll hint — the site has no click navigation, so say so once. */}
      <div
        className="fixed bottom-6 right-6 hidden font-mono text-label-xs uppercase text-ink-faint lg:block"
        style={{ zIndex: 40 }}
        aria-hidden="true"
      >
        scroll to navigate
      </div>
    </>
  )
}

export default Nav
