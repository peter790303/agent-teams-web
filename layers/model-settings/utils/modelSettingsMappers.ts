/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import type { ModelCandidate, CandidateDraft } from '../types'
import type { SavePolicyPayload } from '../types/api'

export interface ModelSettingsMappers {
  blankDraft: () => CandidateDraft
  candidateDraft: (candidate: ModelCandidate) => CandidateDraft
  fromDraft: (draft: CandidateDraft) => ModelCandidate
  modelKey: (model: Pick<ModelCandidate, 'providerId' | 'modelId'>) => string
  finiteNumber: (value: string, label: string) => number
  toPolicyPayload: (whitelist: ModelCandidate[], minQualityScore: number) => SavePolicyPayload
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/

const blankDraft = (): CandidateDraft => ({
  providerId: '',
  modelId: '',
  capabilities: '',
  qualityScore: '',
  costScore: '',
  latencyScore: '',
})

const candidateDraft = (candidate: ModelCandidate): CandidateDraft => ({
  providerId: candidate.providerId,
  modelId: candidate.modelId,
  capabilities: candidate.capabilities.join(', '),
  qualityScore: String(candidate.qualityScore),
  costScore: String(candidate.costScore),
  latencyScore: String(candidate.latencyScore),
})

const finiteNumber = (value: string, label: string): number => {
  if (value.trim() === '') throw new Error(`${label} 必須是有限數字`)
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) throw new Error(`${label} 必須是有限數字`)

  return parsed
}

const fromDraft = (draft: CandidateDraft): ModelCandidate => {
  const capabilities = draft.capabilities
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (!draft.providerId.trim() || !draft.modelId.trim()) throw new Error('Provider 與 Model 必須填寫')
  if (capabilities.length === 0) throw new Error('至少填寫一項能力')

  return {
    providerId: draft.providerId.trim(),
    modelId: draft.modelId.trim(),
    capabilities,
    qualityScore: finiteNumber(draft.qualityScore, '品質分數'),
    costScore: finiteNumber(draft.costScore, '成本分數'),
    latencyScore: finiteNumber(draft.latencyScore, '延遲分數'),
  }
}

const modelKey = (model: Pick<ModelCandidate, 'providerId' | 'modelId'>): string =>
  `${model.providerId}:${model.modelId}`

const toPolicyPayload = (whitelist: ModelCandidate[], minQualityScore: number): SavePolicyPayload => ({
  minQualityScore,
  whitelist,
})

export const useModelSettingsMappers = (): ModelSettingsMappers => ({
  blankDraft,
  candidateDraft,
  fromDraft,
  modelKey,
  finiteNumber,
  toPolicyPayload,
})
