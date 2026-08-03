import { site } from '@/config/site'
import { projects } from '@/config/projects'
import { skillsByCategory } from '@/config/skills'
import { experience } from '@/config/experience'

/**
 * The terminal's command set.
 *
 * Kept as data — a registry of {name, summary, run} — rather than a switch
 * statement, so `help` and the autocomplete both derive from the same source.
 * Add a command here and it documents and completes itself.
 */

export type Line = {
  text: string
  tone?: 'default' | 'accent' | 'muted' | 'ok' | 'warn' | 'err'
}

export type CommandResult = {
  lines: Line[]
  /** Side effect for the shell to perform after printing. */
  action?: { type: 'clear' } | { type: 'download'; href: string } | { type: 'open'; href: string } | { type: 'compose' }
}

export type Command = {
  name: string
  summary: string
  /** Shown in `help` and used for completion, e.g. "contact --email". */
  usage?: string
  run: () => CommandResult
}

const ok = (text: string): Line => ({ text, tone: 'ok' })
const muted = (text: string): Line => ({ text, tone: 'muted' })
const accent = (text: string): Line => ({ text, tone: 'accent' })
const plain = (text: string): Line => ({ text })

export const commands: Command[] = [
  {
    name: 'help',
    summary: 'List every available command',
    run: () => ({
      lines: [
        accent('Available commands'),
        ...commands.map((command) => ({
          text: `  ${(command.usage ?? command.name).padEnd(22)}${command.summary}`,
        })),
        muted(''),
        muted('Tab completes · ↑ ↓ walks history · Ctrl+L clears'),
      ],
    }),
  },
  {
    name: 'whoami',
    summary: 'Who is behind this site',
    run: () => ({
      lines: [
        accent(site.name),
        plain(`${site.role} @ ${site.company}`),
        muted(site.location),
        plain(''),
        ...site.bio.map((paragraph) => plain(paragraph)),
      ],
    }),
  },
  {
    name: 'contact',
    usage: 'contact --email',
    summary: 'Open a mail draft addressed to me',
    run: () => ({
      lines: [ok(`opening mail client → ${site.email}`)],
      action: { type: 'open', href: `mailto:${site.email}` },
    }),
  },
  {
    name: 'mail',
    summary: 'Send me a message without leaving the page',
    run: () => ({
      lines: [
        accent('Composing a message.'),
        muted('Answer three prompts. Ctrl+C or type "cancel" to abort.'),
      ],
      action: { type: 'compose' },
    }),
  },
  {
    name: 'resume',
    usage: 'resume --download',
    summary: 'Download my CV as a PDF',
    run: () => ({
      lines: [ok(`fetching ${site.resume}`)],
      action: { type: 'download', href: site.resume },
    }),
  },
  {
    name: 'socials',
    summary: 'Every link, in one place',
    run: () => ({
      lines: site.socials.map((social) => ({
        text: `  ${social.label.padEnd(12)}${social.href}`,
      })),
    }),
  },
  {
    name: 'projects',
    summary: 'Summarise the work in this portfolio',
    run: () => ({
      lines: projects.flatMap((project) => [
        accent(`${project.index}  ${project.name}`),
        muted(`    ${project.kind} · ${project.environment}`),
        plain(
          `    ${project.outcome.map((metric) => `${metric.label} ${metric.value}`).join('  ·  ')}`,
        ),
      ]),
    }),
  },
  {
    name: 'skills',
    summary: 'Print the full stack, grouped',
    run: () => ({
      lines: skillsByCategory().flatMap((group) => [
        accent(group.label),
        plain(`  ${group.items.map((skill) => skill.label).join(', ')}`),
      ]),
    }),
  },
  {
    name: 'history',
    usage: 'history',
    summary: 'Roles held, most recent first',
    run: () => ({
      lines: experience.map((role) => ({
        text: `  ${role.period.padEnd(24)}${role.role} — ${role.company}`,
        tone: role.status === 'current' ? ('ok' as const) : undefined,
      })),
    }),
  },
  {
    name: 'uptime',
    summary: 'How long this has been the plan',
    run: () => {
      const since = new Date('2023-06-01')
      const days = Math.floor((Date.now() - since.getTime()) / 86_400_000)
      return {
        lines: [
          plain(`up ${days} days — since the first internship, June 2023`),
          muted('load average: coffee, kubectl, terraform'),
        ],
      }
    },
  },
  {
    name: 'clear',
    summary: 'Clear the screen',
    run: () => ({ lines: [], action: { type: 'clear' } }),
  },
]

export const commandNames = commands.map((command) => command.name)

export function findCommand(input: string): Command | undefined {
  const [name] = input.trim().split(/\s+/)
  return commands.find((command) => command.name === name.toLowerCase())
}

/**
 * Longest common prefix of every candidate, for Tab completion.
 *
 * Completing to the shared prefix rather than jumping to the first match is
 * what makes Tab feel like a shell instead of a guess.
 */
export function completionFor(input: string): { completed: string; candidates: string[] } {
  const trimmed = input.trimStart()
  if (!trimmed) return { completed: input, candidates: commandNames }

  const candidates = commandNames.filter((name) => name.startsWith(trimmed))
  if (candidates.length === 0) return { completed: input, candidates: [] }
  if (candidates.length === 1) return { completed: candidates[0], candidates }

  let prefix = candidates[0]
  candidates.forEach((candidate) => {
    while (!candidate.startsWith(prefix)) prefix = prefix.slice(0, -1)
  })
  return { completed: prefix, candidates }
}

export const BANNER: Line[] = [
  accent(`${site.name.toLowerCase().replace(' ', '-')} · interactive shell`),
  muted("Type 'help' for commands, or 'mail' to send me a message."),
]
