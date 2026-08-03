/**
 * The demo cluster's shape.
 *
 * These are illustrative worker nodes for the interactive scene — they describe
 * the kind of topology I run, not a live readout of a real cluster. The
 * Projects section carries the real numbers.
 */

export type WorkerNode = {
  id: string
  role: string
  zone: string
  cpu: string
  memory: string
  /** Pods scheduled here at rest. Scaling up adds to this. */
  pods: number
}

export const controlPlane = {
  id: 'control-plane',
  role: 'Control plane',
  components: ['kube-apiserver', 'etcd', 'scheduler', 'controller-manager'],
  detail:
    'Managed by EKS across three availability zones. The scheduler places new pods on whichever worker has the headroom.',
}

export const workers: WorkerNode[] = [
  { id: 'ip-10-0-1-42', role: 'worker', zone: 'ap-south-1a', cpu: '4 vCPU', memory: '16 GiB', pods: 5 },
  { id: 'ip-10-0-2-17', role: 'worker', zone: 'ap-south-1a', cpu: '4 vCPU', memory: '16 GiB', pods: 4 },
  { id: 'ip-10-0-3-91', role: 'worker', zone: 'ap-south-1b', cpu: '8 vCPU', memory: '32 GiB', pods: 6 },
  { id: 'ip-10-0-4-08', role: 'worker', zone: 'ap-south-1b', cpu: '8 vCPU', memory: '32 GiB', pods: 3 },
  { id: 'ip-10-0-5-63', role: 'worker', zone: 'ap-south-1c', cpu: '4 vCPU', memory: '16 GiB', pods: 5 },
  { id: 'ip-10-0-6-24', role: 'worker', zone: 'ap-south-1c', cpu: '4 vCPU', memory: '16 GiB', pods: 4 },
]

/** Pods a single scale-up event adds, and the ceiling the demo will schedule. */
export const scaleStep = 3
export const maxPodsPerNode = 12
