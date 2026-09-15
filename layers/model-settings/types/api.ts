import type { Role } from '~/layers/domain/types'
export interface PolicyResponse { data?: { role?: unknown; whitelist?: unknown[]; minQualityScore?: unknown; version?: unknown; updatedAt?: unknown } }
export interface HealthResponse { data?: unknown[] }
export interface CapacityResponse { data?: unknown[] }
export interface SavePolicyBody { minQualityScore: number; whitelist: unknown[] }
export type ModelRole = Role
