'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useSound } from '@/lib/audio'
import { setCursor } from '@/lib/cursor'
import { site } from '@/config/site'
import {
  BANNER,
  commandNames,
  completionFor,
  findCommand,
  type Line,
} from './commands'

/**
 * An interactive shell.
 *
 * Built on a real <input> rather than a contenteditable div or key-capturing
 * container. That choice buys, for free: IME and dictation support, mobile
 * keyboards, browser autofill behaviour, native text selection, and correct
 * screen-reader semantics. Terminals hand-rolled on keydown listeners lose all
 * of it and are unusable on a phone.
 *
 * Output is a role="log" with aria-live="polite", so each response is announced
 * once as it appears instead of the whole scrollback being re-read.
 */

const TONE_CLASS: Record<NonNullable<Line['tone']>, string> = {
  default: 'text-ink-secondary',
  accent: 'text-accent',
  muted: 'text-ink-muted',
  ok: 'text-signal-ok',
  warn: 'text-signal-warn',
  err: 'text-signal-err',
}

/** The mail flow's prompts, in order. */
const COMPOSE_STEPS = [
  { key: 'name', prompt: 'your name' },
  { key: 'email', prompt: 'your email' },
  { key: 'message', prompt: 'message' },
] as const

type ComposeState = {
  step: number
  values: { name: string; email: string; message: string }
} | null

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [compose, setCompose] = useState<ComposeState>(null)
  const [sending, setSending] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { play } = useSound()

  const print = useCallback((next: Line[]) => {
    setLines((current) => [...current, ...next])
  }, [])

  // Keep the newest output in view without scrolling the PAGE — scrollTop on
  // the container, never scrollIntoView, which would yank the whole document.
  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [lines])

  const ghost = (() => {
    if (compose || !input.trim()) return ''
    const match = commandNames.find((name) => name.startsWith(input) && name !== input)
    return match ? match.slice(input.length) : ''
  })()

  /* ────────────────────────────────────────────────────── mail flow ── */

  const submitMessage = useCallback(
    async (values: { name: string; email: string; message: string }) => {
      setSending(true)
      print([{ text: 'sending…', tone: 'muted' }])

      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await response.json().catch(() => ({}))

        if (response.ok && data?.success !== false) {
          play('confirm')
          print([
            { text: '✓ message delivered — I usually reply within a day.', tone: 'ok' },
          ])
        } else {
          play('error')
          print([
            {
              text: `✗ ${data?.message ?? 'could not send'} — email me directly at ${site.email}`,
              tone: 'err',
            },
          ])
        }
      } catch {
        play('error')
        print([
          {
            text: `✗ network error — email me directly at ${site.email}`,
            tone: 'err',
          },
        ])
      } finally {
        setSending(false)
      }
    },
    [play, print],
  )

  const advanceCompose = useCallback(
    (value: string) => {
      if (!compose) return

      if (value.trim().toLowerCase() === 'cancel') {
        setCompose(null)
        print([{ text: 'compose cancelled', tone: 'warn' }])
        return
      }

      if (!value.trim()) {
        print([{ text: 'that field is required — try again', tone: 'warn' }])
        return
      }

      const step = COMPOSE_STEPS[compose.step]

      if (step.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        play('error')
        print([{ text: "that doesn't look like an email address", tone: 'err' }])
        return
      }

      const values = { ...compose.values, [step.key]: value.trim() }
      print([{ text: `${step.prompt}: ${value}`, tone: 'muted' }])

      if (compose.step + 1 >= COMPOSE_STEPS.length) {
        setCompose(null)
        void submitMessage(values)
      } else {
        setCompose({ step: compose.step + 1, values })
      }
    },
    [compose, play, print, submitMessage],
  )

  /* ─────────────────────────────────────────────────────── dispatch ── */

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      print([{ text: `$ ${raw}`, tone: 'default' }])

      if (!trimmed) return

      setHistory((current) => [...current, trimmed])
      setHistoryIndex(null)

      const command = findCommand(trimmed)
      if (!command) {
        play('error')
        print([
          { text: `command not found: ${trimmed.split(/\s+/)[0]}`, tone: 'err' },
          { text: "type 'help' to see what's available", tone: 'muted' },
        ])
        return
      }

      play('click')
      const result = command.run()
      print(result.lines)

      switch (result.action?.type) {
        case 'clear':
          setLines([])
          break
        case 'open': {
          const { href } = result.action
          // mailto: must stay in this tab — window.open would leave a blank
          // one behind after the mail client takes over.
          if (href.startsWith('mailto:')) window.location.href = href
          else window.open(href, '_blank', 'noopener,noreferrer')
          break
        }
        case 'download': {
          const { href } = result.action
          const anchor = document.createElement('a')
          anchor.href = href
          anchor.rel = 'noopener'

          /*
           * The `download` attribute is IGNORED for cross-origin URLs — the
           * browser silently navigates instead of saving. The résumé is a
           * Google Docs export, so it relies on that response's
           * Content-Disposition: attachment header to trigger the save, and
           * opens in a new tab so a header change can never navigate the
           * visitor away from the site.
           */
          const sameOrigin = href.startsWith('/') || href.startsWith(window.location.origin)
          if (sameOrigin) anchor.download = ''
          else anchor.target = '_blank'

          document.body.appendChild(anchor)
          anchor.click()
          anchor.remove()
          break
        }
        case 'compose':
          setCompose({ step: 0, values: { name: '', email: '', message: '' } })
          break
      }
    },
    [play, print],
  )

  /* ──────────────────────────────────────────────────────── keyboard ── */

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const value = input
      setInput('')
      if (compose) advanceCompose(value)
      else runCommand(value)
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      if (compose) return
      const { completed, candidates } = completionFor(input)
      if (candidates.length > 1 && completed === input) {
        print([{ text: candidates.join('   '), tone: 'muted' }])
      }
      setInput(completed)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (compose || history.length === 0) return
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (compose || historyIndex === null) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(null)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(history[next])
      }
      return
    }

    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
      return
    }

    if (event.key === 'c' && event.ctrlKey && compose) {
      event.preventDefault()
      setCompose(null)
      print([{ text: '^C', tone: 'warn' }])
    }
  }

  const prompt = compose ? `${COMPOSE_STEPS[compose.step].prompt} ›` : '$'

  return (
    <div
      className="glass rounded-xl"
      onClick={() => inputRef.current?.focus()}
      onPointerEnter={() => setCursor('text')}
      onPointerLeave={() => setCursor('default')}
    >
      {/* chrome */}
      <div className="flex items-center gap-2 border-b border-line-subtle px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          {['var(--signal-err)', 'var(--signal-warn)', 'var(--signal-ok)'].map((dot) => (
            <span
              key={dot}
              className="block h-2.5 w-2.5 rounded-full"
              style={{ background: dot, opacity: 0.75 }}
            />
          ))}
        </span>
        <p className="ml-2 font-mono text-label-xs uppercase text-ink-muted">
          {site.name.toLowerCase().replace(' ', '@')} — zsh
        </p>
      </div>

      <div
        ref={scrollRef}
        className="h-[24rem] overflow-y-auto px-4 py-4 font-mono text-body-sm leading-relaxed"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((line, index) => (
            <p
              key={index}
              className={`whitespace-pre-wrap ${TONE_CLASS[line.tone ?? 'default']}`}
            >
              {line.text || ' '}
            </p>
          ))}
        </div>

        {/* prompt line */}
        <div className="mt-1 flex items-center gap-2">
          <label htmlFor="terminal-input" className="shrink-0 text-accent">
            {prompt}
          </label>

          <div className="relative flex-1">
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              disabled={sending}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-describedby="terminal-hint"
              className="w-full bg-transparent font-mono text-body-sm text-ink outline-none placeholder:text-ink-faint"
              placeholder={compose ? '' : "try 'help'"}
            />

            {/* inline completion hint */}
            {ghost ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 font-mono text-body-sm text-ink-faint"
              >
                <span className="invisible">{input}</span>
                {ghost}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <p id="terminal-hint" className="border-t border-line-subtle px-4 py-2 font-mono text-label-xs text-ink-faint">
        Tab completes · ↑ ↓ history · Ctrl+L clear ·{' '}
        <span className="text-ink-muted">mail</span> sends me a message
      </p>
    </div>
  )
}

export default Terminal
