/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import type { ComputedRef, Ref } from 'vue'

import type { Task } from '~~/layers/domain/task/Task'
import type { Intervention, TaskState } from '~~/layers/domain/task/TaskState'
import type { DispatchStatus } from '~~/layers/domain/task/types/DispatchStatus'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
export type { Role } from '~~/layers/domain/types'
export type { Task } from '~~/layers/domain/task/Task'
export type { Dispatch, Execution, Intervention, TaskState, TaskStateData } from '~~/layers/domain/task/TaskState'
export type { TaskAction as TaskActionResource } from '~~/layers/domain/task/TaskState'
export interface TaskListResource {
  data?: unknown[]
}
export interface TaskResource {
  data?: unknown
}
export interface CreateTaskPayload {
  purpose: string
  projectId: string
}
export interface ResumeTaskPayload {
  instruction: string
  worktree: string
  failedReviewRounds?: number
  extraReviewRoundAllowance?: string
}
export interface SubmitTaskPayload {
  worktree: string
  commit: string
  gate: string
  idempotencyKey: string
}
export interface ActivityItem {
  text: string
  updatedAt: string | null
}
export interface ResumeTaskCommand {
  id: string
  instruction: string
  worktree: string
  failedReviewRounds: number
  extraReviewRoundAllowance: string
}
export interface SubmitTaskCommand {
  id: string
  worktree: string
  commit: string
  gate: string
  idempotencyKey: string
}
export enum OfficeLoadStatusEnum {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
export interface OfficeComposable {
  tasks: Ref<Task[]>
  taskLoadStatus: Ref<OfficeLoadStatusEnum>
  taskStates: Ref<TaskState[]>
  roleStatuses: ComputedRef<Record<string, DispatchStatus>>
  error: Ref<string | null>
  load: () => Promise<void>
  create: (purpose: string, projectId: string) => Promise<void>
  getState: (id: string) => Promise<TaskState>
  getIntervention: (id: string) => Promise<{ data: Intervention | null }>
  resumeTask: (command: ResumeTaskCommand) => Promise<void>
  submitTask: (command: SubmitTaskCommand) => Promise<void>
}
