/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入模型設定流程所需模組
 *********************************************/

import { MODEL_ROLES } from '~~/layers/domain/types'

import { getCapacities, getCatalog, getHealth, getPolicy, savePolicy } from '../../repositories'
import type {
  Capacity,
  HealthEntry,
  ModelCatalog,
  ModelSettingsComposable,
  ModelCandidate,
  PolicyEditor,
  Role,
} from '../../types'

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 模型設定頁面的固定資料
 *********************************************/

const roles: readonly Role[] = MODEL_ROLES
const RD_QUALITY_BASELINE_MODEL_ID = 'gpt-5.6-luna'

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 模型政策載入與儲存
 *********************************************/

const formatModelKey = (model: Pick<ModelCatalog, 'providerId' | 'modelId'>): string =>
  `${model.providerId}:${model.modelId}`

const toWhitelistCandidate = (entry: ModelCatalog): ModelCandidate => ({
  providerId: entry.providerId,
  modelId: entry.modelId,
  capabilities: entry.capabilities,
  qualityScore: entry.qualityScore,
  costScore: entry.costScore,
  latencyScore: entry.latencyScore,
})

export const useModelSettings = (): ModelSettingsComposable => {
  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 模型設定頁面的反應式狀態
   *********************************************/

  const editors = ref<PolicyEditor[]>(
    roles.map((role: Role): PolicyEditor => ({
      role,
      selectedIds: [],
      loadState: 'pending',
    }))
  )
  const capacities = ref<Capacity[]>([])
  const health = ref<HealthEntry[]>([])
  const catalog = ref<ModelCatalog[]>([])
  const catalogState = ref<'pending' | 'loaded' | 'failed'>('pending')
  const catalogError = ref('')
  const message = ref('')
  const error = ref('')

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 模型政策載入與儲存流程
   *********************************************/

  const resolveMinQualityScore = (role: Role): number => {
    if (role !== 'rd') return 0
    const baseline = catalog.value.find((entry: ModelCatalog) => entry.modelId === RD_QUALITY_BASELINE_MODEL_ID)

    return baseline?.qualityScore ?? 0
  }

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
        const role = roles[index] ?? 'rd'
        if (result.status === 'fulfilled') {
          const policy = result.value
          if (!policy) {
            return {
              role,
              selectedIds: [],
              loadState: 'missing' as const,
              loadError: '尚未建立政策，請選擇可用模型後儲存',
            }
          }

          return {
            role,
            selectedIds: policy.data.whitelist.map(formatModelKey),
            loadState: 'loaded' as const,
          }
        }

        return {
          role,
          selectedIds: [],
          loadState: 'failed' as const,
          loadError: '模型政策載入失敗，無法儲存，請稍後重試',
        }
      })
    }
    if (catalogResult.status === 'fulfilled') {
      catalog.value = catalogResult.value
      catalogState.value = 'loaded'
      catalogError.value = ''
    } else {
      catalogState.value = 'failed'
      catalogError.value = '目前無法取得可用模型，請稍後重試'
    }
    if (capacityResult.status === 'fulfilled') capacities.value = capacityResult.value
    if (healthResult.status === 'fulfilled') health.value = healthResult.value
    if (capacityResult.status === 'rejected' || healthResult.status === 'rejected')
      error.value = '部分監控資料暫時無法載入'
  }

  const save = async (editor: PolicyEditor): Promise<void> => {
    if (editor.loadState !== 'loaded' && editor.loadState !== 'missing') {
      editor.validationError = '政策尚未完成載入，無法儲存'

      return
    }
    if (catalogState.value !== 'loaded') {
      editor.validationError = '可用模型尚未載入，無法儲存'

      return
    }
    const selected = new Set(editor.selectedIds)
    const whitelist = catalog.value
      .filter((entry: ModelCatalog) => selected.has(formatModelKey(entry)))
      .map(toWhitelistCandidate)
    try {
      const policy = await savePolicy({
        role: editor.role,
        whitelist,
        minQualityScore: resolveMinQualityScore(editor.role),
      })
      editor.selectedIds = policy.data.whitelist.map(formatModelKey)
      editor.loadState = 'loaded'
      editor.loadError = undefined
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
    save,
    catalogId: formatModelKey,
  }
}
