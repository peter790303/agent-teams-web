import type { Task, TaskStage } from './Task'
import type { DispatchStatus } from './types/DispatchStatus'

export interface Dispatch {
  id: string
  role: string
  status: DispatchStatus
  blockedReasons: string[]
  dependencies: string[]
  updatedAt: string
}
export interface Execution {
  id?: string
  role?: string
  status?: string
  updatedAt?: string
  createdAt?: string
  [key: string]: unknown
}
export interface TaskStateData {
  task: Task
  revision: number
  stage: TaskStage
  activity: string
  updatedAt?: string
  dispatches: Dispatch[]
  executions: Execution[]
  spec: Record<string, unknown> | null
  plan: Record<string, unknown> | null
  workspace: Record<string, unknown> | null
  qaReport: Record<string, unknown> | null
  delivery: Record<string, unknown> | null
}
export interface TaskState {
  data: TaskStateData
}
export interface Intervention {
  status: string
  blockers?: string[]
  instruction?: string
  worktree?: string
  processId?: string
  preview?: string
  automaticWriting?: string
  round?: number
  branch?: string
  commit?: string
  evidence?: unknown
  diagnostics?: unknown
  extraReviewRoundAllowance?: string
}
export interface TaskAction {
  data: Record<string, unknown> | null
}
