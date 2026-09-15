/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import { request } from '~/layers/base/repositories/http'
import type { Model as ModelCandidate } from '~/layers/domain/model/Model'
import { toCapacity, toHealth, toPolicy } from '~/layers/domain/model-settings/assemblers/modelSettings.assembler'
import type {
  CapacityResource,
  HealthResource,
  ModelCatalogResource,
  PolicyResource,
} from '~/layers/domain/model-settings/resources'
import { MODEL_ROLES, type Role } from '~/layers/domain/types'

import type { Capacity, HealthEntry, ModelCatalog, Policy } from '../types'
import { toPolicyPayload } from '../utils/modelSettingsMappers'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/

export interface GetPolicyInput {
  role: Role
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/

const isNotFoundError = (reason: unknown): boolean => {
  if (!reason || typeof reason !== 'object') return false
  const error = reason as { statusCode?: unknown; status?: unknown; response?: { status?: unknown } }

  return error.statusCode === 404 || error.status === 404 || error.response?.status === 404
}

export const getPolicy = async ({ role }: GetPolicyInput): Promise<Policy | null> => {
  try {
    const response = await request<PolicyResource>(`/model-policies/${role}`)

    return toPolicy(response, role)
  } catch (reason) {
    if (isNotFoundError(reason)) return null
    throw reason
  }
}

export interface SavePolicyInput {
  role: Role
  whitelist: ModelCandidate[]
  minQualityScore?: number
}
export const savePolicy = ({ role, whitelist, minQualityScore = 0 }: SavePolicyInput): Promise<Policy> =>
  request<PolicyResource>(`/model-policies/${role}`, {
    method: 'PUT',
    body: toPolicyPayload(whitelist, minQualityScore),
  }).then((response) => toPolicy(response, role))

export const getHealth = (): Promise<HealthEntry[]> => request<HealthResource>('/provider-health').then(toHealth)

export const getCapacities = (): Promise<Capacity[]> => request<CapacityResource>('/roles/capacities').then(toCapacity)

export const getCatalog = (): Promise<ModelCatalog[]> =>
  request<ModelCatalogResource>('/model-policies/catalog').then((response) =>
    (response.data ?? []).flatMap((entry) =>
      typeof entry.providerId === 'string' && typeof entry.modelId === 'string'
        ? [{ providerId: entry.providerId, modelId: entry.modelId }]
        : []
    )
  )

export { MODEL_ROLES }
