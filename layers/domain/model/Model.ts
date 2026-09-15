export interface Model {
  providerId: string
  modelId: string
  capabilities: string[]
  qualityScore: number
  costScore: number
  latencyScore: number
}
