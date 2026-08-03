/**
 * Work history, newest first.
 *
 * `status` drives the signal colour on the 3D timeline — and it is the ONLY
 * thing that does. Roles don't get decorative colours; a current role reads as
 * live, a past one reads as idle.
 */

export type Experience = {
  id: string
  company: string
  role: string
  period: string
  location: string
  status: 'current' | 'completed'
  highlights: string[]
}

export const experience: Experience[] = [
  {
    id: 'nogiz',
    company: 'Nogiz',
    role: 'DevOps Engineer',
    period: 'May 2026 — Present',
    location: 'Remote',
    status: 'current',
    highlights: [
      'Architecting end-to-end DevOps pipelines for production-grade systems.',
      'Container orchestration with Kubernetes and full infrastructure automation via Terraform.',
      'Building CI/CD workflows, monitoring stacks, and alerting for high-availability services.',
    ],
  },
  {
    id: 'coderroots-cloud',
    company: 'CoderRoots',
    role: 'Cloud Engineer',
    period: 'Dec 2025 — Apr 2026',
    location: 'Mohali',
    status: 'completed',
    highlights: [
      'Configured AWS infrastructure across Lambda, EC2, VPC, S3, IAM and CloudWatch.',
      'Optimised cloud resource allocation for measurable cost reduction across services.',
      'Built and maintained CI/CD pipelines for zero-downtime automated deployments.',
    ],
  },
  {
    id: 'coderroots-intern',
    company: 'CoderRoots',
    role: 'Cloud Computing Intern',
    period: 'Jun 2025 — Aug 2025',
    location: 'Mohali',
    status: 'completed',
    highlights: [
      'Deployed and monitored scalable cloud infrastructure on AWS.',
      'Hands-on with core AWS services and infrastructure-as-code principles.',
      'Collaborated with senior engineers to streamline deployment pipelines.',
    ],
  },
  {
    id: 'thinknext',
    company: 'Think Next Tech',
    role: 'Linux / CCNA Intern',
    period: 'Jun 2024 — Aug 2024',
    location: 'Mohali',
    status: 'completed',
    highlights: [
      'Shell scripting and Linux system administration.',
      'IP routing, subnetting, and OSI-layer network design.',
      'Simulated complex enterprise networks with Cisco Packet Tracer.',
    ],
  },
  {
    id: 'excellence',
    company: 'Excellence Tech',
    role: 'Java Developer Intern',
    period: 'Jun 2023 — Aug 2023',
    location: 'Mohali',
    status: 'completed',
    highlights: [
      'Spring Boot applications with secure authentication modules.',
      'REST API design and scalable backend service implementation.',
      'Servlet/JSP work driving analytics-based performance improvements.',
    ],
  },
]
