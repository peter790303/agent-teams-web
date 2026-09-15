export type Role = 'leader' | 'pm' | 'rd_leader' | 'rd' | 'qa'
export interface Task { id: string; purpose: string; projectId: string; stage: string; createdAt?: string; updatedAt?: string }
export interface TaskStateData { task: Task; stage: string; activity: string; dispatches: unknown[]; executions: unknown[]; spec: Record<string, unknown> | null; plan: Record<string, unknown> | null; workspace: Record<string, unknown> | null; qaReport: Record<string, unknown> | null; delivery: Record<string, unknown> | null; blockers?: string[] }
export interface TaskState { data: TaskStateData }
export interface ModelCandidate { providerId: string; modelId: string; capabilities: string[]; qualityScore: number; costScore: number; latencyScore: number; isHealthy?: boolean; hasQuota?: boolean }
export interface PolicyData { role: Role; whitelist: ModelCandidate[]; minQualityScore: number; version: number; updatedAt: string; capacity?: number; rdLimit?: number; staleTtlMs?: number; granularity?: string; affectedModels?: string[] }
export interface Policy { data: PolicyData }
export interface HealthEntry { providerId: string; authStatus: string; callHealth: string; quota: { status: string; isEstimated?: boolean }; affectedModels: string[] }
export interface Health { data: HealthEntry[] }
export interface Capacity { role: Role; initialCapacity: number; currentCapacity: number; maxCapacity: number; activeCount: number; availableCapacity: number; updatedAt: string }
export interface Intervention { status: string; blockers?: string[]; instruction?: string; worktree?: string }
