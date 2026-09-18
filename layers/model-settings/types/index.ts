/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 模型設定型別依賴
 *********************************************/
import type { Ref } from 'vue'

import type { Model as ModelCandidate } from '~/layers/domain/model/Model'
import type {
  Capacity,
  HealthEntry,
  ModelCatalog,
  Policy,
  PolicyData,
} from '~/layers/domain/model-settings/ModelSettings'
import type { Role } from '~/layers/domain/types'

/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 領域型別匯出
 *********************************************/
export type { Role, ModelCandidate, Capacity, HealthEntry, ModelCatalog, Policy, PolicyData }
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 模型設定頁面資料結構
 *********************************************/
export type PolicyLoadState = 'pending' | 'loaded' | 'missing' | 'failed'

export interface PolicyEditor {
  role: Role
  selectedIds: string[]
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
  save: (editor: PolicyEditor) => Promise<void>
  catalogId: (model: Pick<ModelCatalog, 'providerId' | 'modelId'>) => string
}
