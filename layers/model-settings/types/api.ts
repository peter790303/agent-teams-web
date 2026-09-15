import type { Role } from '~/layers/domain/types'
export interface SavePolicyPayload { minQualityScore: number; whitelist: unknown[] }
export type ModelRole = Role
