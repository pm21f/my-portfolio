import SectionHeader from '@/components/shell/SectionHeader'
import { site } from '@/config/site'
import Terminal from './Terminal'

/**
 * CONTACT — section 07.
 *
 * The terminal is the fun way in. The plain links below it are the reliable
 * one, and they are not a fallback that only appears when something fails —
 * they're always there. Making someone discover a command to find an email
 * address would be a puzzle, not a portfolio.
 */
export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader index="07" label="Contact">
          Let&rsquo;s talk about <span className="text-accent-gradient">your infrastructure</span>.
        </SectionHeader>

        <p className="mb-12 mt-6 max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
          I&rsquo;m {site.availability.open ? 'open to DevOps and platform roles' : 'not currently looking'}.
          Use the shell, or just email me — both reach the same inbox.
        </p>

        <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <Terminal />

          <div>
            <h3 className="mb-5 font-mono text-label-md uppercase text-ink-secondary">
              Direct
            </h3>
            <ul className="space-y-4">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 border-b border-line-subtle pb-3 transition-colors duration-fast hover:border-accent"
                  >
                    <span className="font-mono text-label-sm uppercase text-ink-muted">
                      {social.label}
                    </span>
                    <span className="font-mono text-body-sm text-ink-secondary transition-colors duration-fast group-hover:text-accent">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
              {/*
                Two links, because "résumé" means different things to different
                people: a recruiter skimming on a phone wants to read it now,
                and a hiring manager filing it wants the PDF. Forcing a download
                on the first is a good way to lose them.
              */}
              <li className="flex items-baseline justify-between gap-4 border-b border-line-subtle pb-3">
                <span className="font-mono text-label-sm uppercase text-ink-muted">Résumé</span>
                <span className="flex items-baseline gap-3 font-mono text-body-sm">
                  <a
                    href={site.resume.view}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-secondary transition-colors duration-fast hover:text-accent"
                  >
                    read
                  </a>
                  <span aria-hidden="true" className="text-ink-faint">
                    /
                  </span>
                  <a
                    href={site.resume.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-secondary transition-colors duration-fast hover:text-accent"
                  >
                    download PDF
                  </a>
                </span>
              </li>
            </ul>

            <p className="mt-8 font-mono text-label-xs uppercase text-ink-faint">
              Based in {site.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
