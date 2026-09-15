/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import type { Task } from '~/layers/domain/task/Task'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
export type { Role } from '~/layers/domain/types'
export type { Task } from '~/layers/domain/task/Task'
export interface Dispatch { id: string; role: string; status: string; blockedReasons: string[]; dependencies: string[]; updatedAt: string }
export interface TaskListResource { data?: unknown[] }
export interface TaskResource { data?: unknown }
export interface TaskActionResource { data?: Record<string, unknown> | null }
export interface CreateTaskPayload { purpose: string; projectId: string }
export interface ResumeTaskPayload { instruction: string; worktree: string; failedReviewRounds?: number; extraReviewRoundAllowance?: string }
export interface SubmitTaskPayload { worktree: string; commit: string; gate: string; idempotencyKey: string }
export interface TaskStateData { task: Task; revision: number; stage: string; activity: string; dispatches: Dispatch[]; executions: Record<string, unknown>[]; spec: Record<string, unknown> | null; plan: Record<string, unknown> | null; workspace: Record<string, unknown> | null; qaReport: Record<string, unknown> | null; delivery: Record<string, unknown> | null }
export interface TaskState { data: TaskStateData }
export interface Intervention { status: string; blockers?: string[]; instruction?: string; worktree?: string }
