import { request } from '~/layers/base/repositories/http'
import { assembleTask } from '~/layers/domain/task/assemblers/task.assembler'
import type { Task, TaskState, Intervention } from '~/layers/office/types/api'
interface TaskListResponse { data?: unknown[] }
interface TaskResponse { data?: unknown }
export interface CreateTaskInput { purpose: string; projectId: string }
export const listTasks = (): Promise<{ data: Task[] }> => request<TaskListResponse>('/tasks').then((response) => ({ data: (response.data ?? []).map((task) => assembleTask(task as Record<string, unknown>)) }))
export const createTask = ({ purpose, projectId }: CreateTaskInput): Promise<{ data: Task }> => request<TaskResponse>('/tasks', { method: 'POST', body: { purpose, projectId } }).then((response) => ({ data: assembleTask((response.data ?? {}) as Record<string, unknown>) }))
export interface TaskIdInput { id: string }
export const getTaskState = ({ id }: TaskIdInput): Promise<TaskState> => request<TaskState>(`/office/tasks/${encodeURIComponent(id)}/state`)
export const getIntervention = ({ id }: TaskIdInput): Promise<{ data: Intervention | null }> => request<{ data: Intervention | null }>(`/tasks/${encodeURIComponent(id)}/intervention`)
export interface ResumeTaskInput extends TaskIdInput { instruction: string; worktree: string; failedReviewRounds?: number; extraReviewRoundAllowance?: string }
export const resumeTask = ({ id, instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }: ResumeTaskInput): Promise<unknown> => request(`/tasks/${encodeURIComponent(id)}/intervention/resume`, { method: 'POST', body: { instruction, worktree, failedReviewRounds, extraReviewRoundAllowance } })
export interface SubmitTaskInput extends TaskIdInput { worktree: string; commit: string; gate: string; idempotencyKey: string }
export const submitTask = ({ id, worktree, commit, gate, idempotencyKey }: SubmitTaskInput): Promise<unknown> => request(`/tasks/${encodeURIComponent(id)}/intervention/submit`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: { worktree, commit, gate, idempotencyKey } })
