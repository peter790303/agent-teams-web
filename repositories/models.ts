import type { Health, Policy } from '~/types/api'
import { request } from './http'
export const getPolicy = (role: string) => request<Policy>(`/model-policies/${role}`)
export const savePolicy = (role: string, whitelist: Array<{ modelId: string }>) => request<Policy>(`/model-policies/${role}`, { method: 'PUT', body: { minQualityScore: 0, whitelist } })
export const selectModel = (role: string) => request(`/model-policies/${role}/select`, { method: 'POST', body: { requiredCapabilities: ['code'] } })
export const getHealth = () => request<Health>('/provider-health')
