/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入模型設定 helper 所需型別
 *********************************************/

import type { CandidateDraft, ModelCandidate, PolicyEditor, Role } from '../types'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 模型設定純 helper 對外介面
 *********************************************/

export interface ModelSettingsHelpers {
  createBlankDraft: () => CandidateDraft
  createEditor: (role: Role) => PolicyEditor
  convertCandidateToDraft: (candidate: ModelCandidate) => CandidateDraft
  convertDraftToCandidate: (draft: CandidateDraft) => ModelCandidate
  convertFiniteNumber: (value: string, label: string) => number
  formatModelKey: (model: Pick<ModelCandidate, 'providerId' | 'modelId'>) => string
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 模型設定純轉換與建立函式
 *********************************************/

const createBlankDraft = (): CandidateDraft => ({
  providerId: '',
  modelId: '',
  capabilities: '',
  qualityScore: '',
  costScore: '',
  latencyScore: '',
})
const formatModelKey = (model: Pick<ModelCandidate, 'providerId' | 'modelId'>): string =>
  `${model.providerId}:${model.modelId}`
const convertCandidateToDraft = (candidate: ModelCandidate): CandidateDraft => ({
  providerId: candidate.providerId,
  modelId: candidate.modelId,
  capabilities: candidate.capabilities.join(', '),
  qualityScore: String(candidate.qualityScore),
  costScore: String(candidate.costScore),
  latencyScore: String(candidate.latencyScore),
})
const convertFiniteNumber = (value: string, label: string): number => {
  if (value.trim() === '') throw new Error(`${label} 必須是有限數字`)
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) throw new Error(`${label} 必須是有限數字`)

  return parsed
}
const convertDraftToCandidate = (draft: CandidateDraft): ModelCandidate => {
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
    qualityScore: convertFiniteNumber(draft.qualityScore, '品質分數'),
    costScore: convertFiniteNumber(draft.costScore, '成本分數'),
    latencyScore: convertFiniteNumber(draft.latencyScore, '延遲分數'),
  }
}
const createEditor = (role: Role): PolicyEditor => ({
  role,
  minQualityScore: '0',
  version: 0,
  updatedAt: '',
  candidates: [],
  selectedIds: [],
  candidateDrafts: {},
  draft: createBlankDraft(),
  loadState: 'pending',
})

export const useModelSettingsHelpers = (): ModelSettingsHelpers => ({
  createBlankDraft,
  createEditor,
  convertCandidateToDraft,
  convertDraftToCandidate,
  convertFiniteNumber,
  formatModelKey,
})
