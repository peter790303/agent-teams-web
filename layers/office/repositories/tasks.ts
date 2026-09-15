import { request } from '~/layers/base/repositories/http'
import type { Task, TaskState, Intervention } from '~/layers/office/types/api'
export const listTasks = (): Promise<{ data: Task[] }> => request<{ data: Task[] }>('/tasks')
export const createTask = (purpose: string, projectId: string): Promise<{ data: Task }> => request<{ data: Task }>('/tasks', { method: 'POST', body: { purpose, projectId } })
export const getTaskState = (id: string): Promise<TaskState> => request<TaskState>(`/office/tasks/${encodeURIComponent(id)}/state`)
export const getIntervention = (id: string): Promise<{ data: Intervention }> => request<{ data: Intervention }>(`/tasks/${encodeURIComponent(id)}/intervention`)
export const resumeTask = (id: string, instruction: string, worktree: string): Promise<unknown> => request(`/tasks/${encodeURIComponent(id)}/intervention/resume`, { method: 'POST', body: { instruction, worktree } })
export const submitTask = (id: string, worktree: string, commit: string, gate: string, idempotencyKey: string): Promise<unknown> => request(`/tasks/${encodeURIComponent(id)}/intervention/submit`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: { worktree, commit, gate, idempotencyKey } })
