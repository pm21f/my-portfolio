import SectionHeader from '@/components/shell/SectionHeader'
import PipelineViewer from './PipelineViewer'

/**
 * CI/CD PIPELINE — section 01.
 *
 * The header is server-rendered here; the stage prose is rendered (all of it,
 * always) inside PipelineViewer, which is a client component and therefore
 * still produces HTML on the server. Nothing about this section's content
 * depends on JavaScript having run.
 */
export function Pipeline() {
  return (
    <section id="pipeline" className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-32 lg:px-24">
        <SectionHeader index="01" label="Delivery">
          Every commit takes the <span className="text-accent-gradient">same road</span> to
          production.
        </SectionHeader>
        <p className="mt-6 max-w-xl font-mono text-body-sm leading-relaxed text-ink-muted text-pretty">
          Scroll to follow a change through the pipeline — from a push to a reconciled
          cluster. Five gates, each of which can stop the release.
        </p>
      </div>

      <PipelineViewer />
    </section>
  )
}

export default Pipeline
