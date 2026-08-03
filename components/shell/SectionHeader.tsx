import type { ReactNode } from 'react'

/**
 * The shared section opener: index, mono label, display headline.
 *
 * A server component — no 'use client'. The headings are the page's document
 * outline and its SEO surface, so they must exist in the HTML response, not be
 * assembled after hydration.
 */
export function SectionHeader({
  index,
  label,
  children,
  align = 'left',
  className = '',
}: {
  index: string
  label: string
  children: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <header className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <div
        className={`mb-5 flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
        <span className="font-mono text-label-md uppercase text-ink-muted">
          <span className="text-accent">{index}</span> — {label}
        </span>
      </div>
      <h2 className="max-w-3xl font-display text-display-lg font-bold text-balance text-ink">
        {children}
      </h2>
    </header>
  )
}

export default SectionHeader
