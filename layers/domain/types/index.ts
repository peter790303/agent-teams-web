export type Role = 'leader' | 'pm' | 'rd_leader' | 'rd' | 'qa'

export interface Task {
  id: string
  purpose: string
  projectId: string
  stage: string
  createdAt?: string
  updatedAt?: string
}

export interface ModelCandidate {
  providerId: string
  modelId: string
  capabilities: string[]
  qualityScore: number
  costScore: number
  latencyScore: number
}
