import { request } from '~/layers/base/repositories/http'
import { assembleTask } from '~/layers/domain/task/assemblers/task.assembler'
import type { Task, TaskState, Intervention, TaskListResource, TaskResource, TaskActionResource, CreateTaskPayload, ResumeTaskPayload, SubmitTaskPayload } from '~/layers/office/types/api'
export interface RepositoryResult<T> { data: T | null; error: string | null }
const failure = (reason: unknown): string => reason instanceof Error ? reason.message : 'API 請求失敗'
const result = async <T>(operation: Promise<T>): Promise<RepositoryResult<T>> => {
  try { return { data: await operation, error: null } } catch (reason) { return { data: null, error: failure(reason) } }
}
export interface CreateTaskInput { purpose: string; projectId: string }
export const listTasks = (): Promise<RepositoryResult<Task[]>> => result(request<TaskListResource>('/tasks').then((response) => (response.data ?? []).map((task) => assembleTask(task as Record<string, unknown>))))
export const createTask = ({ purpose, projectId }: CreateTaskInput): Promise<RepositoryResult<Task>> => { const payload: CreateTaskPayload = { purpose, projectId }; return result(request<TaskResource>('/tasks', { method: 'POST', body: payload }).then((response) => assembleTask((response.data ?? {}) as Record<string, unknown>))) }
export interface TaskIdInput { id: string }
export const getTaskState = ({ id }: TaskIdInput): Promise<RepositoryResult<TaskState>> => result(request<TaskState>(`/office/tasks/${encodeURIComponent(id)}/state`))
export const getIntervention = ({ id }: TaskIdInput): Promise<RepositoryResult<Intervention | null>> => result(request<{ data: Intervention | null }>(`/tasks/${encodeURIComponent(id)}/intervention`).then((response) => response.data ?? null))
export interface ResumeTaskInput extends TaskIdInput { instruction: string; worktree: string; failedReviewRounds?: number; extraReviewRoundAllowance?: string }
export const resumeTask = ({ id, instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }: ResumeTaskInput): Promise<RepositoryResult<TaskActionResource>> => { const payload: ResumeTaskPayload = { instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }; return result(request<TaskActionResource>(`/tasks/${encodeURIComponent(id)}/intervention/resume`, { method: 'POST', body: payload })) }
export interface SubmitTaskInput extends TaskIdInput { worktree: string; commit: string; gate: string; idempotencyKey: string }
export const submitTask = ({ id, worktree, commit, gate, idempotencyKey }: SubmitTaskInput): Promise<RepositoryResult<TaskActionResource>> => { const payload: SubmitTaskPayload = { worktree, commit, gate, idempotencyKey }; return result(request<TaskActionResource>(`/tasks/${encodeURIComponent(id)}/intervention/submit`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: payload })) }
