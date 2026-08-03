'use client'

import { useBootProgress } from '@/lib/boot'
import { useTypewriter } from '@/lib/motion'
import { site } from '@/config/site'

/**
 * The live-typing line under the name.
 *
 * The typed text is duplicated in a visually-hidden span so a screen reader
 * announces the whole sentence once, rather than receiving 40 separate
 * mutations as characters arrive. The animated copy is aria-hidden.
 *
 * Typing waits for the preloader to finish — starting underneath it means the
 * animation is over before anyone sees it.
 */
export function TerminalLine() {
  const { progress } = useBootProgress()
  const started = progress >= 1

  const command = `whoami`
  const answer = site.roleLine

  const typed = useTypewriter(answer, { speed: 46, delay: 420, start: started })

  return (
    <p className="font-mono text-body-md text-ink-secondary">
      <span className="sr-only">{answer}</span>

      <span aria-hidden="true" className="flex flex-wrap items-center gap-x-2">
        <span className="text-ink-faint">$</span>
        <span className="text-ink-muted">{command}</span>
        <span className="text-ink-faint">→</span>
        <span className="text-accent">{typed.text}</span>
        <span
          className="inline-block h-[1.1em] w-[0.5ch] translate-y-[0.15em] bg-accent"
          style={{
            animation: typed.done ? 'none' : undefined,
            opacity: typed.done ? undefined : 1,
          }}
          data-caret={typed.done ? 'idle' : 'typing'}
        />
      </span>

      <style jsx>{`
        [data-caret='idle'] {
          animation: caret 1.1s step-end infinite;
        }
        @keyframes caret {
          0%,
          45% {
            opacity: 1;
          }
          50%,
          95% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-caret] {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </p>
  )
}

export default TerminalLine
