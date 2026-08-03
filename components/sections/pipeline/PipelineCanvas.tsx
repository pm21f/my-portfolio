'use client'

import type { MutableRefObject } from 'react'
import Scene from '@/components/three/Scene'
import PipelineScene from './PipelineScene'

/**
 * The pipeline canvas chunk. See HeroScene for why <Scene> is imported here
 * rather than beside the gate.
 *
 * `progress` arrives as a ref and is read inside useFrame — it deliberately
 * never becomes state, so scrolling this section re-renders nothing.
 */
export function PipelineCanvas({
  progress,
  activeIndex,
}: {
  progress: MutableRefObject<number>
  activeIndex: number
}) {
  return (
    <Scene
      className="absolute inset-0"
      label="A horizontal pipeline of light travelling through five gates: commit, build, test, scan and deploy"
      cameraPosition={[0, 2.6, 8.4]}
    >
      <PipelineScene progress={progress} activeIndex={activeIndex} />
    </Scene>
  )
}

export default PipelineCanvas
