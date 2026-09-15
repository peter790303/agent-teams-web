import type { Task, TaskState } from '~/types/api'
import { request } from './http'
export const listTasks = () => request<{ data: Task[] }>('/tasks')
export const createTask = (purpose: string) => request<{ data: Task }>('/tasks', { method: 'POST', body: { purpose } })
export const getTaskState = (id: string) => request<TaskState>(`/office/tasks/${encodeURIComponent(id)}/state`)
