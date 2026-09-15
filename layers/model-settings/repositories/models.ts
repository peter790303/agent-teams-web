import { request } from '~/layers/base/repositories/http'
import type { Capacity, Health, ModelCandidate, Policy, Role } from '~/layers/office/types/api'
export const getPolicy = (role: Role): Promise<Policy> => request<Policy>(`/model-policies/${role}`)
export const savePolicy = (role: Role, whitelist: ModelCandidate[], minQualityScore = 0): Promise<Policy> => request<Policy>(`/model-policies/${role}`, { method: 'PUT', body: { minQualityScore, whitelist } })
export const selectModel = (role: Role, requiredCapabilities: string[] = ['code']): Promise<unknown> => request(`/model-policies/${role}/select`, { method: 'POST', body: { requiredCapabilities } })
export const getHealth = (): Promise<Health> => request<Health>('/provider-health')
export const getCapacities = (): Promise<{ data: Capacity[] }> => request<{ data: Capacity[] }>('/roles/capacities')
