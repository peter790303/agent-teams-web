import type { Role } from '~/layers/domain/types'
export interface PolicyResource { data?: { role?: unknown; whitelist?: unknown[]; minQualityScore?: unknown; version?: unknown; updatedAt?: unknown } }
export interface HealthResource { data?: unknown[] }
export interface CapacityResource { data?: unknown[] }
export interface SavePolicyPayload { minQualityScore: number; whitelist: unknown[] }
export type ModelRole = Role
