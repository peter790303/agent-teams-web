/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import { request } from '~~/layers/base/repositories/http'
import { useTaskAssemblers } from '~~/layers/domain/task/assemblers/taskAssemblers'
import { useTaskStateAssemblers } from '~~/layers/domain/task/assemblers/taskStateAssemblers'
import type {
  Task,
  TaskState,
  Intervention,
  TaskListResource,
  TaskResource,
  CreateTaskPayload,
  ResumeTaskPayload,
  SubmitTaskPayload,
} from '~~/layers/office/types/api'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
export interface RepositoryResult<T> {
  data: T | null
  error: string | null
}
export interface CreateTaskInput {
  purpose: string
  projectId: string
}
export interface TaskIdInput {
  id: string
}
export interface ResumeTaskInput extends TaskIdInput {
  instruction: string
  worktree: string
  failedReviewRounds?: number
  extraReviewRoundAllowance?: string
}
export interface SubmitTaskInput extends TaskIdInput {
  worktree: string
  commit: string
  gate: string
  idempotencyKey: string
}

const { toTask } = useTaskAssemblers()
const { toTaskState, toIntervention, toTaskAction } = useTaskStateAssemblers()

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/
const failure = (reason: unknown): string => (reason instanceof Error ? reason.message : 'API 請求失敗')
const result = async <T>(operation: Promise<T>): Promise<RepositoryResult<T>> => {
  try {
    return { data: await operation, error: null }
  } catch (reason) {
    return { data: null, error: failure(reason) }
  }
}
export const listTasks = (): Promise<RepositoryResult<Task[]>> =>
  result(
    request<TaskListResource>('/tasks').then((response) =>
      (response.data ?? []).map((task) => toTask(task as Record<string, unknown>)),
    ),
  )
export const createTask = ({ purpose, projectId }: CreateTaskInput): Promise<RepositoryResult<Task>> => {
  const payload: CreateTaskPayload = { purpose, projectId }

  return result(
    request<TaskResource>('/tasks', { method: 'POST', body: payload }).then((response) =>
      toTask((response.data ?? {}) as Record<string, unknown>),
    ),
  )
}
export const getTaskState = ({ id }: TaskIdInput): Promise<RepositoryResult<TaskState>> =>
  result(request<unknown>(`/office/tasks/${encodeURIComponent(id)}/state`).then((response) => toTaskState(response)))
export const getIntervention = ({ id }: TaskIdInput): Promise<RepositoryResult<Intervention | null>> =>
  result(
    request<unknown>(`/tasks/${encodeURIComponent(id)}/intervention`).then((response) =>
      toIntervention((response as { data?: unknown }).data),
    ),
  )
export const resumeTask = ({
  id,
  instruction,
  worktree,
  failedReviewRounds,
  extraReviewRoundAllowance,
}: ResumeTaskInput): Promise<RepositoryResult<import('~~/layers/domain/task/TaskState').TaskAction>> => {
  const payload: ResumeTaskPayload = { instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }

  return result(
    request<unknown>(`/tasks/${encodeURIComponent(id)}/intervention/resume`, {
      method: 'POST',
      body: payload,
    }).then((response) => toTaskAction(response)),
  )
}
export const submitTask = ({
  id,
  worktree,
  commit,
  gate,
  idempotencyKey,
}: SubmitTaskInput): Promise<RepositoryResult<import('~~/layers/domain/task/TaskState').TaskAction>> => {
  const payload: SubmitTaskPayload = { worktree, commit, gate, idempotencyKey }

  return result(
    request<unknown>(`/tasks/${encodeURIComponent(id)}/intervention/submit`, {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: payload,
    }).then((response) => toTaskAction(response)),
  )
}
