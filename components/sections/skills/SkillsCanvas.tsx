'use client'

import Scene from '@/components/three/Scene'
import SkillSphere from './SkillSphere'

export function SkillsCanvas({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <Scene
      className="absolute inset-0"
      label="A rotating sphere of technology labels that can be dragged to rotate and clicked to filter projects"
      cameraPosition={[0, 0, 17]}
    >
      <SkillSphere selected={selected} onSelect={onSelect} />
    </Scene>
  )
}

export default SkillsCanvas
