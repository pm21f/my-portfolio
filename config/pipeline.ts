/**
 * The CI/CD section's five stages.
 *
 * Scroll position maps linearly onto this array: 0 → commit, 1 → deploy. Add a
 * sixth stage and the pipeline geometry, the light packets, and the scroll
 * mapping all extend on their own — nothing downstream hard-codes "5".
 */

export type PipelineStage = {
  id: string
  /** Shell-style label rendered above the node. */
  command: string
  title: string
  /** One line, present tense — this is the panel's lead. */
  summary: string
  /** Tools actually used at this stage. */
  tools: string[]
  /** Plausible stage duration, shown in the panel's HUD strip. */
  duration: string
}

export const pipeline: PipelineStage[] = [
  {
    id: 'commit',
    command: 'git push origin',
    title: 'Commit',
    summary:
      'Trunk-based flow with short-lived feature branches. Conventional commits gate the changelog, and a pre-commit hook runs formatters before anything leaves the machine.',
    tools: ['Git', 'GitHub', 'Conventional Commits', 'pre-commit'],
    duration: '~2s',
  },
  {
    id: 'build',
    command: 'docker build --push',
    title: 'Build',
    summary:
      'Multi-stage Dockerfiles produce minimal runtime images. Layer caching keyed on the lockfile means a dependency-free change rebuilds in seconds, not minutes.',
    tools: ['Docker', 'BuildKit', 'AWS ECR', 'Jenkins'],
    duration: '~90s',
  },
  {
    id: 'test',
    command: 'make test',
    title: 'Test',
    summary:
      'Unit and integration suites run in parallel against ephemeral service containers. Coverage thresholds fail the build rather than filing a warning nobody reads.',
    tools: ['Jest', 'Go test', 'Testcontainers', 'JUnit'],
    duration: '~65s',
  },
  {
    id: 'scan',
    command: 'trivy image --severity HIGH,CRITICAL',
    title: 'Scan',
    summary:
      'Image and dependency scanning plus static analysis. High and critical findings block promotion; everything below is logged and triaged on a schedule.',
    tools: ['Trivy', 'SonarQube', 'Dependabot', 'tfsec'],
    duration: '~40s',
  },
  {
    id: 'deploy',
    command: 'argocd app sync',
    title: 'Deploy',
    summary:
      'GitOps handoff — Argo CD reconciles the cluster to the committed manifests. Blue-green cutover with automated rollback if health probes fail the canary window.',
    tools: ['Argo CD', 'Helm', 'Kubernetes', 'Blue-green'],
    duration: '~45s',
  },
]
