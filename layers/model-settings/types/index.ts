export type Role = 'leader' | 'pm' | 'rd_leader' | 'rd' | 'qa'
export interface ModelCandidate { providerId: string; modelId: string; capabilities: string[]; qualityScore: number; costScore: number; latencyScore: number }
export interface PolicyData { role: Role; whitelist: ModelCandidate[]; minQualityScore?: number; version: number; updatedAt: string }
export interface Policy { data: PolicyData }
export interface HealthEntry { providerId: string; targetAccountId: string | null; sourceGranularity: string; authStatus: string; callHealth: string; quota: { status: string; amount: number | null; unit: string | null; isEstimated: boolean; estimatedReason: string | null }; affectedModels: string[]; observedAt: string; isStale: boolean; consecutiveFailures: number }
export interface Health { data: HealthEntry[] }
export interface Capacity { role: Role; initialCapacity: number; currentCapacity: number; maxCapacity: number; activeCount: number; availableCapacity: number; updatedAt: string }
