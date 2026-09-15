import type { Model } from '../Model'
export interface ModelCandidateWire { providerId?: unknown; modelId?: unknown; capabilities?: unknown; qualityScore?: unknown; costScore?: unknown; latencyScore?: unknown }

export function assembleModel(input: ModelCandidateWire): Model {
  const numberOrZero = (value: unknown): number => typeof value === 'number' && Number.isFinite(value) ? value : 0
  return { providerId: String(input.providerId ?? ''), modelId: String(input.modelId ?? ''), capabilities: Array.isArray(input.capabilities) ? input.capabilities.map(String) : [], qualityScore: numberOrZero(input.qualityScore), costScore: numberOrZero(input.costScore), latencyScore: numberOrZero(input.latencyScore) }
}
