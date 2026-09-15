import { request } from '~/layers/base/repositories/http'
import { assembleTask } from '~/layers/domain/task/assemblers/task.assembler'
import type { Task, TaskState, Intervention, TaskListResource, TaskResource, TaskActionResource, CreateTaskPayload, ResumeTaskPayload, SubmitTaskPayload } from '~/layers/office/types/api'
export interface CreateTaskInput { purpose: string; projectId: string }
export const listTasks = (): Promise<{ data: Task[] }> => request<TaskListResource>('/tasks').then((response) => ({ data: (response.data ?? []).map((task) => assembleTask(task as Record<string, unknown>)) }))
export const createTask = ({ purpose, projectId }: CreateTaskInput): Promise<{ data: Task }> => { const payload: CreateTaskPayload = { purpose, projectId }; return request<TaskResource>('/tasks', { method: 'POST', body: payload }).then((response) => ({ data: assembleTask((response.data ?? {}) as Record<string, unknown>) })) }
export interface TaskIdInput { id: string }
export const getTaskState = ({ id }: TaskIdInput): Promise<TaskState> => request<TaskState>(`/office/tasks/${encodeURIComponent(id)}/state`)
export const getIntervention = ({ id }: TaskIdInput): Promise<{ data: Intervention | null }> => request<{ data: Intervention | null }>(`/tasks/${encodeURIComponent(id)}/intervention`)
export interface ResumeTaskInput extends TaskIdInput { instruction: string; worktree: string; failedReviewRounds?: number; extraReviewRoundAllowance?: string }
export const resumeTask = ({ id, instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }: ResumeTaskInput): Promise<TaskActionResource> => { const payload: ResumeTaskPayload = { instruction, worktree, failedReviewRounds, extraReviewRoundAllowance }; return request<TaskActionResource>(`/tasks/${encodeURIComponent(id)}/intervention/resume`, { method: 'POST', body: payload }) }
export interface SubmitTaskInput extends TaskIdInput { worktree: string; commit: string; gate: string; idempotencyKey: string }
export const submitTask = ({ id, worktree, commit, gate, idempotencyKey }: SubmitTaskInput): Promise<TaskActionResource> => { const payload: SubmitTaskPayload = { worktree, commit, gate, idempotencyKey }; return request<TaskActionResource>(`/tasks/${encodeURIComponent(id)}/intervention/submit`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: payload }) }
