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
   * Drop the PDF at public/resume.pdf. The contact terminal's
   * `resume --download` command reads this path.
   */
  resume: '/resume.pdf',

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
   * Headline figures for the hero. `suffix` is rendered outside the count-up so
   * the animation only ever tweens a real number.
   */
  stats: [
    { label: 'Years experience', value: 2, suffix: '+' },
    { label: 'Systems shipped', value: 4, suffix: '' },
    { label: 'Certifications', value: 2, suffix: '' },
  ],

  /** Short bio — rendered as real text in the hero's scroll-out panel. */
  bio: [
    'Final-year Computer Science Engineering student (Class of 2026) and DevOps Engineer at Nogiz, where I architect AWS infrastructure and automate the parts nobody should be doing by hand.',
    'My work sits between code and production: CI/CD pipelines, Kubernetes orchestration, and monitoring stacks that let a team deploy on a Friday without flinching.',
    'I also lead the VECTOR Student Club as Cloud Lead, running workshops on cloud architecture for students building their first real infrastructure.',
  ],

  credentials: [
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
