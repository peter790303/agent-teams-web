import { MODEL_ROLES } from '~/layers/domain/types'

import { getCapacities, getCatalog, getHealth, getPolicy, savePolicy } from '../repositories'
import type { Capacity, HealthEntry, ModelCandidate, ModelCatalog, Role } from '../types'

/*********************************************
 * 📂 Category: Interfaces
 * 🔧 Defines: 模型設定頁面的表單與載入狀態
 *********************************************/

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
  role: Role
  minQualityScore: string
  version: number
  updatedAt: string
  candidates: ModelCandidate[]
  selectedIds: string[]
  candidateDrafts: Record<string, CandidateDraft>
  draft: CandidateDraft
  loadState: PolicyLoadState
  loadError?: string
  validationError?: string
}

const roles: readonly Role[] = MODEL_ROLES
const blank = (): CandidateDraft => ({
  providerId: '',
  modelId: '',
  capabilities: 'code',
  qualityScore: '0',
  costScore: '0',
  latencyScore: '0',
})
const id = (model: Pick<ModelCandidate, 'providerId' | 'modelId'>): string => `${model.providerId}:${model.modelId}`
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
const createEditor = (role: Role): PolicyEditor => ({
  role,
  minQualityScore: '0',
  version: 0,
  updatedAt: '',
  candidates: [],
  selectedIds: [],
  candidateDrafts: {},
  draft: blank(),
  loadState: 'pending',
})

export function useModelSettings() {
  const editors = ref<PolicyEditor[]>(roles.map(createEditor))
  const capacities = ref<Capacity[]>([])
  const health = ref<HealthEntry[]>([])
  const catalog = ref<ModelCatalog[]>([])
  const catalogState = ref<'pending' | 'loaded' | 'failed'>('pending')
  const catalogError = ref('')
  const message = ref('')
  const error = ref('')
  const load = async (): Promise<void> => {
    const [policies, catalogResult, capacityResult, healthResult] = await Promise.allSettled([
      Promise.allSettled(roles.map((role) => getPolicy({ role }))),
      getCatalog(),
      getCapacities(),
      getHealth(),
    ])
    if (policies.status === 'fulfilled')
      policies.value.forEach((result, index) => {
        const editor = editors.value[index]
        if (result.status === 'fulfilled') {
          const policy = result.value
          if (!policy) {
            editor.loadState = 'missing'
            editor.loadError = '尚未建立政策，可直接新增候選模型'

            return
          }
          const data = policy.data
          editor.loadState = 'loaded'
          editor.loadError = undefined
          editor.minQualityScore = String(data.minQualityScore ?? 0)
          editor.version = data.version
          editor.updatedAt = data.updatedAt
          editor.candidates = data.whitelist
          editor.selectedIds = data.whitelist.map(id)
          editor.candidateDrafts = Object.fromEntries(
            data.whitelist.map((candidate) => [id(candidate), candidateDraft(candidate)])
          )
        } else {
          editor.loadState = 'failed'
          editor.loadError = '模型政策載入失敗，無法儲存，請稍後重試'
        }
      })
    if (catalogResult.status === 'fulfilled') {
      catalog.value = catalogResult.value
      catalogState.value = 'loaded'
      catalogError.value = ''
    } else {
      catalogState.value = 'failed'
      catalogError.value = '目前無法取得 Provider 支援模型，請稍後重試'
    }
    if (capacityResult.status === 'fulfilled') capacities.value = capacityResult.value
    if (healthResult.status === 'fulfilled') health.value = healthResult.value
    if (capacityResult.status === 'rejected' || healthResult.status === 'rejected')
      error.value = '部分監控資料暫時無法載入'
  }
  const addCandidate = (editor: PolicyEditor): void => {
    try {
      const candidate = fromDraft(editor.draft)
      const candidateId = id(candidate)
      if (!editor.candidates.some((item) => id(item) === candidateId)) {
        editor.candidates.push(candidate)
        editor.candidateDrafts[candidateId] = candidateDraft(candidate)
        editor.selectedIds.push(candidateId)
      }
      editor.draft = blank()
      editor.validationError = undefined
    } catch (reason) {
      editor.validationError = reason instanceof Error ? reason.message : '候選模型資料無效'
    }
  }
  const selectCatalogModel = (editor: PolicyEditor, modelId: string): void => {
    const model = catalog.value.find((entry: ModelCatalog) => entry.modelId === modelId)
    if (model) {
      editor.draft.providerId = model.providerId
      editor.draft.modelId = model.modelId
    }
  }
  const toggle = (editor: PolicyEditor, candidate: ModelCandidate): void => {
    const candidateId = id(candidate)
    const index = editor.selectedIds.indexOf(candidateId)
    if (index >= 0) editor.selectedIds.splice(index, 1)
    else editor.selectedIds.push(candidateId)
  }
  const save = async (editor: PolicyEditor): Promise<void> => {
    if (editor.loadState !== 'loaded' && editor.loadState !== 'missing') {
      editor.validationError = '政策尚未完成載入，無法儲存'

      return
    }
    try {
      const candidates = editor.candidates.map((candidate) =>
        fromDraft(editor.candidateDrafts[id(candidate)] ?? candidateDraft(candidate))
      )
      const selectedIds = new Set(editor.selectedIds)
      await savePolicy({
        role: editor.role,
        whitelist: candidates.filter((candidate) => selectedIds.has(id(candidate))),
        minQualityScore: finiteNumber(editor.minQualityScore, '最低品質分數'),
      })
      editor.validationError = undefined
      message.value = `${editor.role} 已儲存`
      error.value = ''
    } catch (reason) {
      editor.validationError = reason instanceof Error ? reason.message : '模型政策儲存失敗'
      error.value = editor.validationError
    }
  }

  return {
    editors,
    capacities,
    health,
    catalog,
    catalogState,
    catalogError,
    message,
    error,
    load,
    addCandidate,
    selectCatalogModel,
    toggle,
    save,
    id,
  }
}
