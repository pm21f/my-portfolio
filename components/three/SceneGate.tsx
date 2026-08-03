'use client'

import type { ReactNode } from 'react'
import { useLightweight, usePerf } from '@/lib/perf'

/**
 * <SceneGate> — decides whether a 3D chunk is downloaded at all.
 *
 * This component imports NOTHING from three.js, and that is its entire reason
 * for existing. Each section's canvas lives behind a `dynamic(() => import(…))`
 * boundary; if the gate never renders the 3D branch, the browser never
 * requests that chunk.
 *
 * The alternative — mounting the canvas component and letting it decide
 * internally to render a fallback — still ships ~400KB of three.js, drei and
 * post-processing to a phone that will never draw a single frame with it.
 * Deciding one level up is what makes the low-power path genuinely cheap
 * instead of merely invisible.
 *
 * Rendering nothing until `ready` is deliberate: detection resolves within a
 * frame, and briefly showing the fallback to a capable machine (then swapping)
 * would cost a layout shift for no benefit.
 */
export function SceneGate({
  fallback,
  children,
}: {
  fallback: ReactNode
  children: ReactNode
}) {
  const { ready } = usePerf()
  const lightweight = useLightweight()

  if (!ready) return null
  if (lightweight) return <>{fallback}</>
  return <>{children}</>
}

export default SceneGate
