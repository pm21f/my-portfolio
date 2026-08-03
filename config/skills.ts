/**
 * The stack, as nodes on the skills sphere.
 *
 * `projects` is what makes the sphere interactive rather than decorative:
 * clicking a skill filters the Projects section to the entries listed here.
 * A skill with an empty `projects` array is still shown, just not clickable —
 * so don't pad it to make something look connected.
 *
 * `logo` is an optional path under public/logos/*.svg. When absent the sphere
 * renders the label as type, which is the current state (see README).
 */

import type { ProjectSlug } from './projects'

export type SkillCategory = 'cloud' | 'containers' | 'cicd' | 'observability' | 'systems'

export type Skill = {
  id: string
  label: string
  category: SkillCategory
  projects: ProjectSlug[]
  logo?: string
}

export const categories: Record<SkillCategory, { label: string; index: string }> = {
  cloud: { label: 'Cloud & Infrastructure', index: '01' },
  containers: { label: 'Containers & Orchestration', index: '02' },
  cicd: { label: 'CI/CD & Infrastructure as Code', index: '03' },
  observability: { label: 'Observability & Streaming', index: '04' },
  systems: { label: 'Systems & Languages', index: '05' },
}

export const skills: Skill[] = [
  /* ── cloud ── */
  { id: 'aws', label: 'AWS', category: 'cloud', projects: ['k8s-platform', 'observability-stack'] },
  { id: 'eks', label: 'EKS', category: 'cloud', projects: ['k8s-platform', 'ci-cd-pipeline'] },
  { id: 'ec2', label: 'EC2', category: 'cloud', projects: ['observability-stack'] },
  { id: 'lambda', label: 'Lambda', category: 'cloud', projects: [] },
  { id: 's3', label: 'S3', category: 'cloud', projects: ['observability-stack'] },
  { id: 'vpc', label: 'VPC', category: 'cloud', projects: ['k8s-platform'] },
  { id: 'iam', label: 'IAM', category: 'cloud', projects: ['k8s-platform'] },
  { id: 'cloudwatch', label: 'CloudWatch', category: 'cloud', projects: ['observability-stack'] },

  /* ── containers ── */
  { id: 'docker', label: 'Docker', category: 'containers', projects: ['ci-cd-pipeline', 'k8s-platform'] },
  { id: 'kubernetes', label: 'Kubernetes', category: 'containers', projects: ['k8s-platform', 'kafka-streaming', 'ci-cd-pipeline'] },
  { id: 'helm', label: 'Helm', category: 'containers', projects: ['k8s-platform', 'observability-stack'] },
  { id: 'ingress', label: 'Ingress-NGINX', category: 'containers', projects: ['k8s-platform'] },
  { id: 'hpa', label: 'HPA / VPA', category: 'containers', projects: ['k8s-platform'] },
  { id: 'strimzi', label: 'Strimzi', category: 'containers', projects: ['kafka-streaming'] },

  /* ── ci/cd + iac ── */
  { id: 'jenkins', label: 'Jenkins', category: 'cicd', projects: ['ci-cd-pipeline'] },
  { id: 'actions', label: 'GitHub Actions', category: 'cicd', projects: ['ci-cd-pipeline'] },
  { id: 'terraform', label: 'Terraform', category: 'cicd', projects: ['k8s-platform', 'kafka-streaming'] },
  { id: 'ansible', label: 'Ansible', category: 'cicd', projects: [] },
  { id: 'argocd', label: 'Argo CD', category: 'cicd', projects: ['ci-cd-pipeline'] },
  { id: 'sonarqube', label: 'SonarQube', category: 'cicd', projects: ['ci-cd-pipeline'] },
  { id: 'vault', label: 'Vault', category: 'cicd', projects: [] },
  { id: 'packer', label: 'Packer', category: 'cicd', projects: [] },

  /* ── observability + streaming ── */
  { id: 'prometheus', label: 'Prometheus', category: 'observability', projects: ['observability-stack', 'kafka-streaming'] },
  { id: 'grafana', label: 'Grafana', category: 'observability', projects: ['observability-stack', 'kafka-streaming'] },
  { id: 'loki', label: 'Loki', category: 'observability', projects: ['observability-stack'] },
  { id: 'alertmanager', label: 'Alertmanager', category: 'observability', projects: ['observability-stack'] },
  { id: 'kafka', label: 'Kafka', category: 'observability', projects: ['kafka-streaming'] },
  { id: 'elk', label: 'ELK Stack', category: 'observability', projects: [] },

  /* ── systems ── */
  { id: 'linux', label: 'Linux', category: 'systems', projects: ['observability-stack'] },
  { id: 'go', label: 'Go', category: 'systems', projects: [] },
  { id: 'python', label: 'Python', category: 'systems', projects: [] },
  { id: 'bash', label: 'Bash', category: 'systems', projects: ['ci-cd-pipeline'] },
]

/** Skills grouped for the SSR'd list that sits behind the canvas. */
export function skillsByCategory() {
  return (Object.keys(categories) as SkillCategory[]).map((key) => ({
    key,
    ...categories[key],
    items: skills.filter((skill) => skill.category === key),
  }))
}
