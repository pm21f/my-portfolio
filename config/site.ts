/**
 * Identity, links, and navigation.
 *
 * This is the file to edit first when handing the site to someone else — no
 * component hard-codes a name, URL, or email.
 */

export const site = {
  name: 'Piyush Modgil',
  /** Split for the hero's two-line stacked display type. */
  nameParts: ['PIYUSH', 'MODGIL'] as const,

  role: 'DevOps Engineer',
  company: 'Nogiz',
  roleLine: 'DevOps Engineer @ Nogiz',

  location: 'Una, Himachal Pradesh, India',
  /** IANA zone — drives the "local time" readout in the hero HUD. */
  timezone: 'Asia/Kolkata',

  email: 'piyushmodgil9@gmail.com',

  /**
   * The résumé lives in Google Docs, which gives two useful URLs from one
   * document — no PDF to re-export and re-commit every time it changes.
   *
   *   view      /preview renders read-only with none of the Docs editing
   *             chrome. Do NOT use the /edit link a share dialog hands you:
   *             it drops visitors into the editor UI, and anyone with edit
   *             access could change the document from it.
   *   download  /export?format=pdf streams a real PDF with a
   *             Content-Disposition attachment header, so the browser saves
   *             it rather than displaying it.
   *
   * Both require the document to be shared as "anyone with the link can
   * view". If you tighten that, both links break for everyone but you.
   */
  resume: {
    view: 'https://docs.google.com/document/d/1WGaHmfKs5PXxZ-DSE_0JyLUxQ6SiR3E2yEIByBmL38s/preview',
    download:
      'https://docs.google.com/document/d/1WGaHmfKs5PXxZ-DSE_0JyLUxQ6SiR3E2yEIByBmL38s/export?format=pdf',
  },

  tagline: 'I build infrastructure that stays up.',

  /** Used for <meta description> and the JSON-LD blob. Keep under ~155 chars. */
  description:
    'DevOps Engineer specialising in AWS, Kubernetes, Terraform and CI/CD. I design infrastructure that ships fast and stays up.',

  /** Set to your production origin — canonical URLs and OG images derive from it. */
  url: 'https://piyushmodgil.vercel.app',

  availability: {
    open: true,
    label: 'Available for DevOps roles',
  },

  socials: [
    { label: 'GitHub', handle: 'pm21f', href: 'https://github.com/pm21f' },
    { label: 'LinkedIn', handle: 'piyushmodgil', href: 'https://linkedin.com/in/piyushmodgil' },
    { label: 'Email', handle: 'piyushmodgil9@gmail.com', href: 'mailto:piyushmodgil9@gmail.com' },
  ],

  /**
   * Headline figures for the hero.
   *
   * `value` is the number the count-up tweens to and `suffix` is rendered
   * outside it, so the animation only ever handles a real number. A stat with
   * no meaningful number (a rank, a ratio) sets `display` instead and skips the
   * count-up entirely — faking a tween on "Top 1%" would mean animating
   * through percentages that were never true.
   */
  stats: [
    { label: 'Hackathons won', value: 29, suffix: '+', of: 'from 40+ entered' },
    { label: 'Global rank', display: 'Top 1%', of: 'competitive hackathons' },
    { label: 'Clients shipped for', value: 15, suffix: '+', of: 'international, freelance' },
    { label: 'Years experience', value: 2, suffix: '+', of: 'DevOps and cloud' },
  ],

  /**
   * The two claims that go above everything else on the page.
   *
   * These are separated from `stats` because they carry a sentence, not just a
   * figure — and because they earn the largest type on the site after the name
   * itself. Order matters: the band renders them in sequence.
   */
  highlights: [
    {
      id: 'hackathons',
      figure: '29+',
      unit: 'wins from 40+ entered',
      title: 'Hackathon champion',
      detail:
        'Won 29 of more than 40 national and international competitions — a Top 1% global rank among competitive hackathon participants.',
      badge: 'Top 1% globally',
    },
    {
      id: 'freelance',
      figure: '15+',
      unit: 'international clients',
      title: 'Freelance cloud engineer',
      detail:
        'Delivered production-grade AWS infrastructure and backend systems for more than 15 international clients, from first provision to handover.',
      badge: 'Production workloads',
    },
  ],

  /** Short bio — rendered as real text in the hero's scroll-out panel. */
  bio: [
    'Final-year Computer Science Engineering student (Class of 2026) and DevOps Engineer at Nogiz, where I architect AWS infrastructure and automate the parts nobody should be doing by hand.',
    'My work sits between code and production: CI/CD pipelines, Kubernetes orchestration, and monitoring stacks that let a team deploy on a Friday without flinching.',
    'I also lead the VECTOR Student Club as Cloud Lead, running workshops on cloud architecture for students building their first real infrastructure.',
  ],

  credentials: [
    { title: '29+ hackathon wins from 40+ entered — Top 1% globally', issuer: 'National & international competitions', year: '2023—2026' },
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { title: 'HashiCorp Terraform Associate', issuer: 'HashiCorp', year: '2023' },
    { title: 'Hackathon Winner — Project Supertech', issuer: 'Maharaja Agrasen College', year: '2025' },
    { title: 'Hackathon Winner — Project Prayas', issuer: 'Maharaja Agrasen College', year: '2025' },
  ],
} as const

/**
 * Section order. This array is the source of truth for three things at once:
 * the nav, the keyboard skip targets, and the scroll-spy — so a section can
 * never appear in one and not the others.
 */
export const sections = [
  { id: 'hero', label: 'Home', index: '00' },
  { id: 'pipeline', label: 'Pipeline', index: '01' },
  { id: 'cluster', label: 'Cluster', index: '02' },
  { id: 'skills', label: 'Stack', index: '03' },
  { id: 'experience', label: 'Experience', index: '04' },
  { id: 'projects', label: 'Work', index: '05' },
  { id: 'observability', label: 'Telemetry', index: '06' },
  { id: 'contact', label: 'Contact', index: '07' },
] as const

export type SectionId = (typeof sections)[number]['id']
