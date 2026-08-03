import SectionHeader from '@/components/shell/SectionHeader'
import ClusterViewer from './ClusterViewer'

/**
 * KUBERNETES CLUSTER — section 02.
 */
export function Cluster() {
  return (
    <section id="cluster" className="relative px-6 py-32 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="Orchestration">
          A cluster is only <span className="text-accent-gradient">as good</span> as its
          scheduler.
        </SectionHeader>

        <p className="mb-14 mt-6 max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
          Hover a node to inspect it. Scale up and watch the scheduler place new pods on
          whichever worker has the most headroom — the same rule that runs in production.
        </p>

        <ClusterViewer />
      </div>
    </section>
  )
}

export default Cluster
