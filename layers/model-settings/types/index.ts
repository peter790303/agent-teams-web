/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 模型設定型別依賴
 *********************************************/
import type { Ref } from 'vue'

/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 領域型別匯出
 *********************************************/
export type { Role } from '~/layers/domain/types'
export type { Model as ModelCandidate } from '~/layers/domain/model/Model'
export type { Capacity, HealthEntry, Policy, PolicyData } from '~/layers/domain/model-settings/ModelSettings'
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 模型設定頁面資料結構
 *********************************************/
export interface ModelCatalog {
  providerId: string
  modelId: string
}

export interface CandidateDraft {
  providerId: string
  modelId: string
  capabilities: string
  qualityScore: string
  costScore: string
  latencyScore: string
}

export type PolicyLoadState = 'pending' | 'loaded' | 'missing' | 'failed'

export interface PolicyEditor {
  role: import('~/layers/domain/types').Role
  minQualityScore: string
  version: number
  updatedAt: string
  candidates: import('~/layers/domain/model/Model').Model[]
  selectedIds: string[]
  candidateDrafts: Record<string, CandidateDraft>
  draft: CandidateDraft
  loadState: PolicyLoadState
  loadError?: string
  validationError?: string
}

export interface ModelSettingsComposable {
  editors: Ref<PolicyEditor[]>
  capacities: Ref<import('~/layers/domain/model-settings/ModelSettings').Capacity[]>
  health: Ref<import('~/layers/domain/model-settings/ModelSettings').HealthEntry[]>
  catalog: Ref<ModelCatalog[]>
  catalogState: Ref<'pending' | 'loaded' | 'failed'>
  catalogError: Ref<string>
  message: Ref<string>
  error: Ref<string>
  load: () => Promise<void>
  addCandidate: (editor: PolicyEditor) => void
  selectCatalogModel: (editor: PolicyEditor, modelKey: string) => void
  toggle: (editor: PolicyEditor, candidate: import('~/layers/domain/model/Model').Model) => void
  save: (editor: PolicyEditor) => Promise<void>
  id: (model: Pick<import('~/layers/domain/model/Model').Model, 'providerId' | 'modelId'>) => string
  catalogId: (model: Pick<ModelCatalog, 'providerId' | 'modelId'>) => string
}
