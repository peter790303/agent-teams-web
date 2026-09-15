export type { Role } from '~/layers/domain/types'
export type { Task } from '~/layers/domain/task/Task'
import type { Role } from '~/layers/domain/types'
import type { Task } from '~/layers/domain/task/Task'
export interface Dispatch { id: string; role: string; status: string; blockedReasons: string[]; dependencies: string[]; updatedAt: string }
export interface TaskStateData { task: Task; revision: number; stage: string; activity: string; dispatches: Dispatch[]; executions: Record<string, unknown>[]; spec: Record<string, unknown> | null; plan: Record<string, unknown> | null; workspace: Record<string, unknown> | null; qaReport: Record<string, unknown> | null; delivery: Record<string, unknown> | null }
export interface TaskState { data: TaskStateData }
export interface ModelCandidate { providerId: string; modelId: string; capabilities: string[]; qualityScore: number; costScore: number; latencyScore: number; isHealthy?: boolean; hasQuota?: boolean }
export interface PolicyData { role: Role; whitelist: ModelCandidate[]; minQualityScore: number; version: number; updatedAt: string; capacity?: number; rdLimit?: number; staleTtlMs?: number; granularity?: string; affectedModels?: string[] }
export interface Policy { data: PolicyData }
export interface HealthEntry { providerId: string; targetAccountId: string | null; sourceGranularity: string; authStatus: string; callHealth: string; quota: { status: string; amount: number | null; unit: string | null; isEstimated: boolean; estimatedReason: string | null }; affectedModels: string[]; observedAt: string; isStale: boolean; consecutiveFailures: number }
export interface Health { data: HealthEntry[] }
export interface Capacity { role: Role; initialCapacity: number; currentCapacity: number; maxCapacity: number; activeCount: number; availableCapacity: number; updatedAt: string }
export interface Intervention { status: string; blockers?: string[]; instruction?: string; worktree?: string }
