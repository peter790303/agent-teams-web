/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 模型領域型別
 *********************************************/
import type { Model } from '../Model'

/*********************************************
 * 📂 Category: Interfaces
 * 🔧 Defines: 模型 API 輸入型別
 *********************************************/
export interface ModelCandidateWire {
  providerId?: unknown
  modelId?: unknown
  capabilities?: unknown
  qualityScore?: unknown
  costScore?: unknown
  latencyScore?: unknown
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 將 API 輸入轉為領域模型
 *********************************************/
const toModel = (input: ModelCandidateWire): Model => {
  const numberOrZero = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0)

  return {
    providerId: String(input.providerId ?? ''),
    modelId: String(input.modelId ?? ''),
    capabilities: Array.isArray(input.capabilities) ? input.capabilities.map(String) : [],
    qualityScore: numberOrZero(input.qualityScore),
    costScore: numberOrZero(input.costScore),
    latencyScore: numberOrZero(input.latencyScore),
  }
}

export const useModelAssemblers = (): { toModel: (input: ModelCandidateWire) => Model } => ({ toModel })
