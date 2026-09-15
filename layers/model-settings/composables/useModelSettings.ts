/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import { getCapacities, getHealth, getPolicy, savePolicy } from '../repositories'
import type { Capacity, HealthEntry, ModelCandidate, Role } from '../types'
import { MODEL_ROLES } from '~/layers/domain/types'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/

export interface CandidateDraft { providerId: string; modelId: string; capabilities: string; qualityScore: string; costScore: string; latencyScore: string }
export type PolicyLoadState = 'pending' | 'loaded' | 'missing' | 'failed'
export interface PolicyEditor { role: Role; minQualityScore: string; version: number; updatedAt: string; candidates: ModelCandidate[]; selectedIds: string[]; candidateDrafts: Record<string, CandidateDraft>; draft: CandidateDraft; loadState: PolicyLoadState; loadError?: string; validationError?: string }

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/

const roles: readonly Role[] = MODEL_ROLES
const blank = (): CandidateDraft => ({ providerId: '', modelId: '', capabilities: 'code', qualityScore: '0', costScore: '0', latencyScore: '0' })
const id = (model: Pick<ModelCandidate, 'providerId' | 'modelId'>): string => `${model.providerId}:${model.modelId}`
const candidateDraft = (candidate: ModelCandidate): CandidateDraft => ({ providerId: candidate.providerId, modelId: candidate.modelId, capabilities: candidate.capabilities.join(', '), qualityScore: String(candidate.qualityScore), costScore: String(candidate.costScore), latencyScore: String(candidate.latencyScore) })
const finiteNumber = (value: string, label: string): number => { if (value.trim() === '') throw new Error(`${label} 必須是有限數字`); const parsed = Number(value); if (!Number.isFinite(parsed)) throw new Error(`${label} 必須是有限數字`); return parsed }
const fromDraft = (draft: CandidateDraft): ModelCandidate => { const capabilities = draft.capabilities.split(',').map((value) => value.trim()).filter(Boolean); if (!draft.providerId.trim() || !draft.modelId.trim()) throw new Error('Provider 與 Model 必須填寫'); if (capabilities.length === 0) throw new Error('至少填寫一項能力'); return { providerId: draft.providerId.trim(), modelId: draft.modelId.trim(), capabilities, qualityScore: finiteNumber(draft.qualityScore, '品質分數'), costScore: finiteNumber(draft.costScore, '成本分數'), latencyScore: finiteNumber(draft.latencyScore, '延遲分數') } }
const createEditor = (role: Role): PolicyEditor => ({ role, minQualityScore: '0', version: 0, updatedAt: '', candidates: [], selectedIds: [], candidateDrafts: {}, draft: blank(), loadState: 'pending' })

/*********************************************
 * 📂 Category: Refs / Reactive State
 * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
 *********************************************/

export function useModelSettings(): { editors: Ref<PolicyEditor[]>; capacities: Ref<Capacity[]>; health: Ref<HealthEntry[]>; message: Ref<string>; error: Ref<string>; load: () => Promise<void>; addCandidate: (editor: PolicyEditor) => void; toggle: (editor: PolicyEditor, candidate: ModelCandidate) => void; save: (editor: PolicyEditor) => Promise<void>; id: (model: Pick<ModelCandidate, 'providerId' | 'modelId'>) => string } {
  const editors = ref<PolicyEditor[]>(roles.map(createEditor)); const capacities = ref<Capacity[]>([]); const health = ref<HealthEntry[]>([]); const message = ref(''); const error = ref('')

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/

  const load = async (): Promise<void> => { const results = await Promise.allSettled(roles.map((role) => getPolicy({ role }))); results.forEach((result, index) => { const editor = editors.value[index]; if (result.status === 'fulfilled') { const policy = result.value; if (!policy) { editor.loadState = 'missing'; editor.loadError = '尚未建立政策，可直接新增候選模型'; return } const data = policy.data; editor.loadState = 'loaded'; editor.loadError = undefined; editor.minQualityScore = String(data.minQualityScore ?? 0); editor.version = data.version; editor.updatedAt = data.updatedAt; editor.candidates = data.whitelist; editor.selectedIds = data.whitelist.map((candidate) => id(candidate)); editor.candidateDrafts = Object.fromEntries(data.whitelist.map((candidate) => [id(candidate), candidateDraft(candidate)])) } else { editor.loadState = 'failed'; editor.loadError = '模型政策載入失敗，無法儲存，請稍後重試' } }); const [capacityResult, healthResult] = await Promise.allSettled([getCapacities(), getHealth()]); if (capacityResult.status === 'fulfilled') capacities.value = capacityResult.value; if (healthResult.status === 'fulfilled') health.value = healthResult.value; if (capacityResult.status === 'rejected' || healthResult.status === 'rejected') error.value = '部分監控資料暫時無法載入' }
  const addCandidate = (editor: PolicyEditor): void => { try { const candidate = fromDraft(editor.draft); const candidateId = id(candidate); editor.candidates.push(candidate); editor.candidateDrafts[candidateId] = candidateDraft(candidate); editor.selectedIds.push(candidateId); editor.draft = blank(); editor.validationError = undefined } catch (reason) { editor.validationError = reason instanceof Error ? reason.message : '候選模型資料無效' } }
  const toggle = (editor: PolicyEditor, candidate: ModelCandidate): void => { const candidateId = id(candidate); const index = editor.selectedIds.indexOf(candidateId); if (index >= 0) editor.selectedIds.splice(index, 1); else editor.selectedIds.push(candidateId) }
  const save = async (editor: PolicyEditor): Promise<void> => { if (editor.loadState !== 'loaded' && editor.loadState !== 'missing') { editor.validationError = '政策尚未完成載入，無法儲存'; return } try { const candidates = editor.candidates.map((candidate) => fromDraft(editor.candidateDrafts[id(candidate)] ?? candidateDraft(candidate))); const minQualityScore = finiteNumber(editor.minQualityScore, '最低品質分數'); const selectedIds = new Set(editor.selectedIds); await savePolicy({ role: editor.role, whitelist: candidates.filter((candidate) => selectedIds.has(id(candidate))), minQualityScore }); editor.validationError = undefined; message.value = `${editor.role} 已儲存`; error.value = '' } catch (reason) { editor.validationError = reason instanceof Error ? reason.message : '模型政策儲存失敗'; error.value = editor.validationError } }
  return { editors, capacities, health, message, error, load, addCandidate, toggle, save, id }
}
