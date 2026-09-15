import { request } from '~/layers/base/repositories/http'
import type { Model as ModelCandidate } from '~/layers/domain/model/Model'
import { MODEL_ROLES, type Role } from '~/layers/domain/types'
import type { Capacity, HealthEntry, Policy } from '../types'
import type { CapacityResource, HealthResource, PolicyResource } from '../types/api'
import { toCapacity, toHealth, toPolicy, toPolicyPayload } from '../utils/modelSettingsMappers'

export interface GetPolicyInput { role: Role }
export const getPolicy = ({ role }: GetPolicyInput): Promise<Policy> =>
  request<PolicyResource>(`/model-policies/${role}`).then((response) => toPolicy(response, role))

export interface SavePolicyInput { role: Role; whitelist: ModelCandidate[]; minQualityScore?: number }
export const savePolicy = ({ role, whitelist, minQualityScore = 0 }: SavePolicyInput): Promise<Policy> =>
  request<PolicyResource>(`/model-policies/${role}`, {
    method: 'PUT',
    body: toPolicyPayload(whitelist, minQualityScore),
  }).then((response) => toPolicy(response, role))

export const getHealth = (): Promise<HealthEntry[]> =>
  request<HealthResource>('/provider-health').then(toHealth)

export const getCapacities = (): Promise<Capacity[]> =>
  request<CapacityResource>('/roles/capacities').then(toCapacity)

export { MODEL_ROLES }
