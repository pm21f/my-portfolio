'use client'

import Scene from '@/components/three/Scene'
import ClusterScene, { type PodInstance } from './ClusterScene'

export function ClusterCanvas({
  pods,
  hovered,
  onHover,
}: {
  pods: PodInstance[]
  hovered: number | null
  onHover: (index: number | null) => void
}) {
  return (
    <Scene
      className="absolute inset-0"
      label="An interactive Kubernetes cluster: a control plane at the centre with six worker nodes orbiting it, each carrying pods drawn as small cubes"
      cameraPosition={[0, 3.2, 14]}
    >
      <ClusterScene pods={pods} hovered={hovered} onHover={onHover} />
    </Scene>
  )
}

export default ClusterCanvas
