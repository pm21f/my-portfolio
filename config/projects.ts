/**
 * Case studies.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ STATUS: the four projects, their stacks and their OUTCOME METRICS are   │
 * │ yours, carried over from the previous site. The `problem` and           │
 * │ `architecture` fields are DRAFTED — a plausible reconstruction from the │
 * │ stack, not something you told me. Anything still drafted is flagged     │
 * │ `needsReview: true` and renders a small "draft" marker in the UI so it  │
 * │ can't ship unnoticed. Replace the prose, then delete the flag.          │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * The architecture graph is data, not a picture: `nodes` + `edges` are laid out
 * automatically by column, so you describe the system and the diagram follows.
 */

export type ProjectSlug =
  | 'k8s-platform'
  | 'ci-cd-pipeline'
  | 'kafka-streaming'
  | 'observability-stack'

/** Node roles in the architecture diagram. Drives shape and signal colour. */
export type ArchNodeKind = 'source' | 'compute' | 'data' | 'observe' | 'edge'

export type ArchNode = {
  id: string
  label: string
  kind: ArchNodeKind
  /** 0-indexed column, left to right. Nodes sharing a column stack vertically. */
  column: number
}

export type Project = {
  slug: ProjectSlug
  index: string
  name: string
  kind: string
  environment: string
  /** Operational state, shown as a live-looking status pill. */
  status: 'running' | 'passing' | 'healthy' | 'online'
  summary: string
  problem: string
  architecture: {
    nodes: ArchNode[]
    edges: [string, string][]
    note: string
  }
  outcome: { label: string; value: string; note: string }[]
  stack: string[]
  links: { source?: string; live?: string }
  needsReview?: boolean
}

export const projects: Project[] = [
  {
    slug: 'k8s-platform',
    index: '01',
    name: 'Kubernetes Multi-Environment Platform',
    kind: 'Container Orchestration',
    environment: 'aws / eks',
    status: 'running',
    summary:
      'Production-grade Kubernetes platform on AWS EKS with namespace-isolated dev, staging and prod environments, Helm-packaged workloads, autoscaling and enforced RBAC.',
    problem:
      'Three environments shared one cluster with no hard boundaries between them. A noisy deploy in staging could starve production of scheduling capacity, and every team had blanket cluster-admin because nobody had scoped the permissions.',
    architecture: {
      nodes: [
        { id: 'tf', label: 'Terraform', kind: 'source', column: 0 },
        { id: 'eks', label: 'EKS control plane', kind: 'compute', column: 1 },
        { id: 'ns-dev', label: 'ns: dev', kind: 'compute', column: 2 },
        { id: 'ns-stg', label: 'ns: staging', kind: 'compute', column: 2 },
        { id: 'ns-prod', label: 'ns: prod', kind: 'compute', column: 2 },
        { id: 'helm', label: 'Helm releases', kind: 'data', column: 3 },
        { id: 'hpa', label: 'HPA / VPA', kind: 'observe', column: 3 },
        { id: 'ingress', label: 'Ingress-NGINX', kind: 'edge', column: 4 },
      ],
      edges: [
        ['tf', 'eks'],
        ['eks', 'ns-dev'],
        ['eks', 'ns-stg'],
        ['eks', 'ns-prod'],
        ['ns-dev', 'helm'],
        ['ns-stg', 'helm'],
        ['ns-prod', 'helm'],
        ['ns-prod', 'hpa'],
        ['helm', 'ingress'],
      ],
      note: 'Terraform owns the cluster and the IAM boundary; Helm owns everything inside it. The split matters — it means an application rollback never touches infrastructure state.',
    },
    outcome: [
      { label: 'Uptime', value: '99.99%', note: 'production namespace, rolling 90 days' },
      { label: 'Pods', value: '120+', note: 'steady-state across all namespaces' },
      { label: 'Namespaces', value: '6', note: 'with per-team RBAC and resource quotas' },
    ],
    stack: ['Kubernetes', 'AWS EKS', 'Helm', 'Terraform', 'HPA', 'RBAC', 'Ingress-NGINX'],
    links: { source: 'https://github.com/pm21f' },
    needsReview: true,
  },
  {
    slug: 'ci-cd-pipeline',
    index: '02',
    name: 'Jenkins → Argo CD Delivery Pipeline',
    kind: 'Continuous Delivery',
    environment: 'self-hosted',
    status: 'passing',
    summary:
      'End-to-end delivery pipeline: multi-branch Jenkins builds, containerised test gates, and zero-downtime blue-green releases to EKS reconciled by Argo CD.',
    problem:
      'Deployments were manual and only happened when one person was free to run them, so changes queued up for days and every release bundled a dozen unrelated commits. When one broke, nobody could tell which.',
    architecture: {
      nodes: [
        { id: 'gh', label: 'GitHub', kind: 'source', column: 0 },
        { id: 'jenkins', label: 'Jenkins', kind: 'compute', column: 1 },
        { id: 'test', label: 'Test + SonarQube', kind: 'compute', column: 2 },
        { id: 'ecr', label: 'AWS ECR', kind: 'data', column: 3 },
        { id: 'argo', label: 'Argo CD', kind: 'compute', column: 4 },
        { id: 'eks', label: 'EKS blue/green', kind: 'edge', column: 5 },
      ],
      edges: [
        ['gh', 'jenkins'],
        ['jenkins', 'test'],
        ['test', 'ecr'],
        ['ecr', 'argo'],
        ['argo', 'eks'],
      ],
      note: 'Jenkins stops at the registry — it never talks to the cluster. Argo CD pulls from Git instead, so the running state is always reconcilable against a commit rather than whatever the last job happened to apply.',
    },
    outcome: [
      { label: 'Build time', value: '4 min', note: 'commit to image in registry' },
      { label: 'Success rate', value: '98.5%', note: 'pipeline runs over the last quarter' },
      { label: 'Deploys/day', value: '12+', note: 'up from roughly two per week' },
    ],
    stack: ['Jenkins', 'Docker', 'Argo CD', 'GitHub', 'SonarQube', 'AWS ECR', 'Kubernetes'],
    links: { source: 'https://github.com/pm21f' },
    needsReview: true,
  },
  {
    slug: 'kafka-streaming',
    index: '03',
    name: 'Kafka Event Streaming Infrastructure',
    kind: 'Message Broker',
    environment: 'ap-south-1',
    status: 'healthy',
    summary:
      'High-throughput Kafka cluster on Kubernetes via the Strimzi operator, carrying event-driven traffic between microservices with consumer-lag alerting.',
    problem:
      'Services called each other synchronously over HTTP, so one slow consumer applied backpressure all the way to the user-facing request. There was also no replay: a failed handler lost the event permanently.',
    architecture: {
      nodes: [
        { id: 'producers', label: 'Producer services', kind: 'source', column: 0 },
        { id: 'strimzi', label: 'Strimzi operator', kind: 'compute', column: 1 },
        { id: 'brokers', label: 'Kafka brokers', kind: 'data', column: 2 },
        { id: 'zk', label: 'Zookeeper', kind: 'data', column: 2 },
        { id: 'consumers', label: 'Consumer groups', kind: 'compute', column: 3 },
        { id: 'lag', label: 'Lag exporter', kind: 'observe', column: 3 },
        { id: 'grafana', label: 'Grafana alerts', kind: 'observe', column: 4 },
      ],
      edges: [
        ['producers', 'brokers'],
        ['strimzi', 'brokers'],
        ['strimzi', 'zk'],
        ['brokers', 'consumers'],
        ['brokers', 'lag'],
        ['lag', 'grafana'],
      ],
      note: 'Consumer lag is the health metric that actually matters here. Broker CPU can look fine while a single consumer group falls hours behind, so the alert is on lag, not resource usage.',
    },
    outcome: [
      { label: 'Throughput', value: '50k/s', note: 'peak messages across all topics' },
      { label: 'Consumer lag', value: '< 200ms', note: 'p99 under normal load' },
      { label: 'Topics', value: '18', note: 'with retention tuned per topic' },
    ],
    stack: ['Kafka', 'Strimzi', 'Kubernetes', 'Prometheus', 'Grafana', 'Zookeeper', 'Terraform'],
    links: { source: 'https://github.com/pm21f' },
    needsReview: true,
  },
  {
    slug: 'observability-stack',
    index: '04',
    name: 'Infrastructure Observability Stack',
    kind: 'Observability Platform',
    environment: 'multi-region',
    status: 'online',
    summary:
      'Prometheus, Grafana, Alertmanager and Loki deployed as one Helm-managed stack, giving every service dashboards, alert routing and 90 days of searchable logs.',
    problem:
      'Debugging a production incident meant SSHing into instances and grepping local logs, which are gone the moment a pod restarts. There was no shared picture of what "normal" looked like, so nobody could tell degradation from noise.',
    architecture: {
      nodes: [
        { id: 'exporters', label: 'Node exporters', kind: 'source', column: 0 },
        { id: 'apps', label: 'App /metrics', kind: 'source', column: 0 },
        { id: 'promtail', label: 'Promtail', kind: 'source', column: 0 },
        { id: 'prom', label: 'Prometheus', kind: 'compute', column: 1 },
        { id: 'loki', label: 'Loki', kind: 'data', column: 1 },
        { id: 'grafana', label: 'Grafana', kind: 'observe', column: 2 },
        { id: 'am', label: 'Alertmanager', kind: 'observe', column: 2 },
        { id: 'pd', label: 'PagerDuty', kind: 'edge', column: 3 },
      ],
      edges: [
        ['exporters', 'prom'],
        ['apps', 'prom'],
        ['promtail', 'loki'],
        ['prom', 'grafana'],
        ['loki', 'grafana'],
        ['prom', 'am'],
        ['am', 'pd'],
      ],
      note: 'Metrics and logs land in separate stores but share one query surface in Grafana. That keeps cardinality manageable in Prometheus while still letting you jump from a spiking graph straight to the lines behind it.',
    },
    outcome: [
      { label: 'Dashboards', value: '24', note: 'one per service, plus four cluster-wide' },
      { label: 'Alert rules', value: '80+', note: 'routed by severity and ownership' },
      { label: 'Log retention', value: '90 days', note: 'searchable, S3-backed' },
    ],
    stack: ['Prometheus', 'Grafana', 'Alertmanager', 'Loki', 'Node Exporter', 'Helm', 'AWS CloudWatch'],
    links: { source: 'https://github.com/pm21f' },
    needsReview: true,
  },
]

export function projectBySlug(slug: ProjectSlug) {
  return projects.find((project) => project.slug === slug)
}
