import { getCapacities, getHealth, getPolicy, savePolicy } from '../repositories'
import type { Capacity, HealthEntry, ModelCandidate, Role } from '../types'

export interface PolicyEditor { role: Role; minQualityScore: number; version: number; updatedAt: string; candidates: ModelCandidate[]; selectedIds: string[]; draft: ModelCandidate; loadError?: string }
const roles: Role[] = ['leader', 'pm', 'rd_leader', 'rd', 'qa']
const blank = (): ModelCandidate => ({ providerId: '', modelId: '', capabilities: ['code'], qualityScore: 0, costScore: 0, latencyScore: 0 })
const id = (model: ModelCandidate): string => `${model.providerId}:${model.modelId}`

export function useModelSettings(): { editors: Ref<PolicyEditor[]>; capacities: Ref<Capacity[]>; health: Ref<HealthEntry[]>; message: Ref<string>; error: Ref<string>; load: () => Promise<void>; addCandidate: (editor: PolicyEditor) => void; toggle: (editor: PolicyEditor, candidate: ModelCandidate) => void; save: (editor: PolicyEditor) => Promise<void>; id: (model: ModelCandidate) => string } {
  const editors = ref<PolicyEditor[]>(roles.map((role) => ({ role, minQualityScore: 0, version: 0, updatedAt: '', candidates: [], selectedIds: [], draft: blank() })))
  const capacities = ref<Capacity[]>([])
  const health = ref<HealthEntry[]>([])
  const message = ref('')
  const error = ref('')
  const load = async (): Promise<void> => {
    const results = await Promise.allSettled(roles.map((role) => getPolicy({ role })))
    results.forEach((result, index) => {
      const editor = editors.value[index]
      if (result.status === 'fulfilled') { const data = result.value.data; editor.minQualityScore = data.minQualityScore ?? 0; editor.version = data.version; editor.updatedAt = data.updatedAt; editor.candidates = data.whitelist; editor.selectedIds = data.whitelist.map(id) }
      else editor.loadError = '尚未建立政策，可直接新增候選模型'
    })
    const [capacityResult, healthResult] = await Promise.allSettled([getCapacities(), getHealth()])
    if (capacityResult.status === 'fulfilled') capacities.value = capacityResult.value
    if (healthResult.status === 'fulfilled') health.value = healthResult.value
    if (capacityResult.status === 'rejected' || healthResult.status === 'rejected') error.value = '部分監控資料暫時無法載入'
  }
  const addCandidate = (editor: PolicyEditor): void => { if (!editor.draft.providerId.trim() || !editor.draft.modelId.trim()) return; const candidate = { ...editor.draft, providerId: editor.draft.providerId.trim(), modelId: editor.draft.modelId.trim(), capabilities: [...editor.draft.capabilities] }; editor.candidates.push(candidate); editor.selectedIds.push(id(candidate)); editor.draft = blank() }
  const toggle = (editor: PolicyEditor, candidate: ModelCandidate): void => { const candidateId = id(candidate); const index = editor.selectedIds.indexOf(candidateId); if (index >= 0) editor.selectedIds.splice(index, 1); else editor.selectedIds.push(candidateId) }
  const save = async (editor: PolicyEditor): Promise<void> => { try { await savePolicy({ role: editor.role, whitelist: editor.candidates.filter((candidate) => editor.selectedIds.includes(id(candidate))), minQualityScore: editor.minQualityScore }); message.value = `${editor.role} 已儲存`; error.value = '' } catch (reason) { error.value = reason instanceof Error ? reason.message : '模型政策儲存失敗' } }
  return { editors, capacities, health, message, error, load, addCandidate, toggle, save, id }
}
