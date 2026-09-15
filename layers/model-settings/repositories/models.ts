import { request } from '~/layers/base/repositories/http'
import { assembleModel } from '~/layers/domain/model/assemblers/model.assembler'
import type { Model as ModelCandidate } from '~/layers/domain/model/Model'
import type { Capacity, HealthEntry, Policy, PolicyData } from '../types'
import type { CapacityResponse, HealthResponse, PolicyResponse, SavePolicyBody } from '../types/api'
import type { Role } from '~/layers/domain/types'
const roles: Role[] = ['leader', 'pm', 'rd_leader', 'rd', 'qa']
const asRole = (value: unknown, fallback: Role): Role => roles.includes(value as Role) ? value as Role : fallback
const asNumber = (value: unknown): number => typeof value === 'number' && Number.isFinite(value) ? value : 0
const assemblePolicy = (response: PolicyResponse, fallbackRole: Role): Policy => {
  const data = response.data ?? {}
  const policy: PolicyData = { role: asRole(data.role, fallbackRole), whitelist: (data.whitelist ?? []).map((candidate) => assembleModel(candidate as Record<string, unknown>)), minQualityScore: asNumber(data.minQualityScore), version: asNumber(data.version), updatedAt: String(data.updatedAt ?? '') }
  return { data: policy }
}
export interface GetPolicyInput { role: Role }
export const getPolicy = ({ role }: GetPolicyInput): Promise<Policy> => request<PolicyResponse>(`/model-policies/${role}`).then((response) => assemblePolicy(response, role))
export interface SavePolicyInput { role: Role; whitelist: ModelCandidate[]; minQualityScore?: number }
export const savePolicy = ({ role, whitelist, minQualityScore = 0 }: SavePolicyInput): Promise<Policy> => { const body: SavePolicyBody = { minQualityScore, whitelist }; return request<PolicyResponse>(`/model-policies/${role}`, { method: 'PUT', body }).then((response) => assemblePolicy(response, role)) }
export interface SelectModelInput { role: Role; requiredCapabilities?: string[] }
export const selectModel = ({ role, requiredCapabilities = ['code'] }: SelectModelInput): Promise<unknown> => request(`/model-policies/${role}/select`, { method: 'POST', body: { requiredCapabilities } })
const assembleHealth = (value: unknown): HealthEntry => {
  const entry = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const quota = (entry.quota && typeof entry.quota === 'object' ? entry.quota : {}) as Record<string, unknown>
  return { providerId: String(entry.providerId ?? ''), targetAccountId: typeof entry.targetAccountId === 'string' ? entry.targetAccountId : null, sourceGranularity: String(entry.sourceGranularity ?? 'unknown'), authStatus: String(entry.authStatus ?? 'unknown'), callHealth: String(entry.callHealth ?? 'unknown'), quota: { status: String(quota.status ?? 'unknown'), amount: typeof quota.amount === 'number' ? quota.amount : null, unit: typeof quota.unit === 'string' ? quota.unit : null, isEstimated: quota.isEstimated === true, estimatedReason: typeof quota.estimatedReason === 'string' ? quota.estimatedReason : null }, affectedModels: Array.isArray(entry.affectedModels) ? entry.affectedModels.map(String) : [], observedAt: String(entry.observedAt ?? ''), isStale: entry.isStale === true, consecutiveFailures: asNumber(entry.consecutiveFailures) }
}
const assembleCapacity = (value: unknown): Capacity => { const entry = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>; return { role: asRole(entry.role, 'rd'), initialCapacity: asNumber(entry.initialCapacity), currentCapacity: asNumber(entry.currentCapacity), maxCapacity: asNumber(entry.maxCapacity), activeCount: asNumber(entry.activeCount), availableCapacity: asNumber(entry.availableCapacity), updatedAt: String(entry.updatedAt ?? '') } }
export const getHealth = (): Promise<HealthEntry[]> => request<HealthResponse>('/provider-health').then((response) => (response.data ?? []).map(assembleHealth))
export const getCapacities = (): Promise<Capacity[]> => request<CapacityResponse>('/roles/capacities').then((response) => (response.data ?? []).map(assembleCapacity))
