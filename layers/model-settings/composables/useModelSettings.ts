/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入模型設定流程所需模組
 *********************************************/

import { MODEL_ROLES } from '~/layers/domain/types'

import { getCapacities, getCatalog, getHealth, getPolicy, savePolicy } from '../repositories'
import type {
  Capacity,
  HealthEntry,
  ModelCatalog,
  ModelSettingsComposable,
  ModelCandidate,
  PolicyEditor,
  Role,
} from '../types'
import { useModelSettingsMappers } from '../utils/modelSettingsMappers'

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 模型設定頁面的固定資料
 *********************************************/

const roles: readonly Role[] = MODEL_ROLES
const createEditor = (role: Role): PolicyEditor => {
  const { blankDraft } = useModelSettingsMappers()

  return {
    role,
    minQualityScore: '0',
    version: 0,
    updatedAt: '',
    candidates: [],
    selectedIds: [],
    candidateDrafts: {},
    draft: blankDraft(),
    loadState: 'pending',
  }
}

export const useModelSettings = (): ModelSettingsComposable => {
  const { blankDraft, candidateDraft, fromDraft, finiteNumber, modelKey } = useModelSettingsMappers()

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 模型設定頁面的反應式狀態
   *********************************************/

  const editors = ref<PolicyEditor[]>(roles.map(createEditor))
  const capacities = ref<Capacity[]>([])
  const health = ref<HealthEntry[]>([])
  const catalog = ref<ModelCatalog[]>([])
  const catalogState = ref<'pending' | 'loaded' | 'failed'>('pending')
  const catalogError = ref('')
  const message = ref('')
  const error = ref('')

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 模型政策載入、編輯與儲存流程
   *********************************************/

  const load = async (): Promise<void> => {
    const policiesPromise = Promise.all(
      roles.map(async (role) => {
        try {
          return { status: 'fulfilled' as const, value: await getPolicy({ role }) }
        } catch {
          return { status: 'rejected' as const }
        }
      })
    )
    const [policies, catalogResult, capacityResult, healthResult] = await Promise.allSettled([
      policiesPromise,
      getCatalog(),
      getCapacities(),
      getHealth(),
    ])

    if (policies.status === 'fulfilled') {
      editors.value = policies.value.map((result, index) => {
        const current = editors.value[index]
        const editor: PolicyEditor = {
          ...current,
          candidateDrafts: { ...current.candidateDrafts },
        }
        if (result.status === 'fulfilled') {
          const policy = result.value
          if (!policy) {
            return { ...editor, loadState: 'missing', loadError: '尚未建立政策，可直接新增候選模型' }
          }
          const data = policy.data

          return {
            ...editor,
            loadState: 'loaded',
            loadError: undefined,
            minQualityScore: String(data.minQualityScore ?? 0),
            version: data.version,
            updatedAt: data.updatedAt,
            candidates: data.whitelist,
            selectedIds: data.whitelist.map(modelKey),
            candidateDrafts: Object.fromEntries(
              data.whitelist.map((candidate) => [modelKey(candidate), candidateDraft(candidate)])
            ),
          }
        }

        return { ...editor, loadState: 'failed', loadError: '模型政策載入失敗，無法儲存，請稍後重試' }
      })
    }
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
      const candidateId = modelKey(candidate)
      if (!editor.candidates.some((item) => modelKey(item) === candidateId)) {
        editor.candidates.push(candidate)
        editor.candidateDrafts[candidateId] = candidateDraft(candidate)
        editor.selectedIds.push(candidateId)
      }
      editor.draft = blankDraft()
      editor.validationError = undefined
    } catch (reason) {
      editor.validationError = reason instanceof Error ? reason.message : '候選模型資料無效'
    }
  }

  const selectCatalogModel = (editor: PolicyEditor, selectedKey: string): void => {
    const model = catalog.value.find((entry: ModelCatalog) => modelKey(entry) === selectedKey)
    if (model) {
      editor.draft.providerId = model.providerId
      editor.draft.modelId = model.modelId
    }
  }

  const toggle = (editor: PolicyEditor, candidate: ModelCandidate): void => {
    const candidateId = modelKey(candidate)
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
        fromDraft(editor.candidateDrafts[modelKey(candidate)] ?? candidateDraft(candidate))
      )
      const selectedIds = new Set(editor.selectedIds)
      await savePolicy({
        role: editor.role,
        whitelist: candidates.filter((candidate) => selectedIds.has(modelKey(candidate))),
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
    id: modelKey,
    catalogId: modelKey,
  }
}
