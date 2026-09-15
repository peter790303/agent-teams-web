/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import { toModel } from '../../model/assemblers/model.assembler'
import { MODEL_ROLES, type Role } from '../../types'
import type { Capacity, HealthEntry, Policy, PolicyData } from '../ModelSettings'
import type { CapacityResource, HealthResource, PolicyResource } from '../resources'

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/

const asNumber = (value: unknown): number => typeof value === 'number' && Number.isFinite(value) ? value : 0
const asRole = (value: unknown, fallback: Role): Role => MODEL_ROLES.includes(value as Role) ? value as Role : fallback

export const toPolicy = (response: PolicyResource, fallbackRole: Role): Policy => {
  const data = response.data ?? {}
  const policy: PolicyData = {
    role: asRole(data.role, fallbackRole),
    whitelist: (data.whitelist ?? []).map((candidate) => toModel(candidate as Record<string, unknown>)),
    minQualityScore: asNumber(data.minQualityScore),
    version: asNumber(data.version),
    updatedAt: String(data.updatedAt ?? ''),
  }
  return { data: policy }
}

export const toHealth = (response: HealthResource): HealthEntry[] => (response.data ?? []).map((value) => {
  const entry = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const quota = entry.quota && typeof entry.quota === 'object' ? entry.quota as Record<string, unknown> : {}
  return {
    providerId: String(entry.providerId ?? ''),
    targetAccountId: typeof entry.targetAccountId === 'string' ? entry.targetAccountId : null,
    sourceGranularity: String(entry.sourceGranularity ?? 'unknown'),
    authStatus: String(entry.authStatus ?? 'unknown'),
    callHealth: String(entry.callHealth ?? 'unknown'),
    quota: {
      status: String(quota.status ?? 'unknown'),
      amount: typeof quota.amount === 'number' ? quota.amount : null,
      unit: typeof quota.unit === 'string' ? quota.unit : null,
      isEstimated: quota.isEstimated === true,
      estimatedReason: typeof quota.estimatedReason === 'string' ? quota.estimatedReason : null,
    },
    affectedModels: Array.isArray(entry.affectedModels) ? entry.affectedModels.map(String) : [],
    observedAt: String(entry.observedAt ?? ''),
    isStale: entry.isStale === true,
    consecutiveFailures: asNumber(entry.consecutiveFailures),
  }
})

export const toCapacity = (response: CapacityResource): Capacity[] => (response.data ?? []).map((value) => {
  const entry = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  return {
    role: asRole(entry.role, 'rd'),
    initialCapacity: asNumber(entry.initialCapacity),
    currentCapacity: asNumber(entry.currentCapacity),
    maxCapacity: asNumber(entry.maxCapacity),
    activeCount: asNumber(entry.activeCount),
    availableCapacity: asNumber(entry.availableCapacity),
    updatedAt: String(entry.updatedAt ?? ''),
  }
})

export const useModelSettingsAssemblers = (): {
  toPolicy: typeof toPolicy
  toHealth: typeof toHealth
  toCapacity: typeof toCapacity
} => ({ toPolicy, toHealth, toCapacity })
