import type { Task } from '../Task'

export interface TaskWire { id?: unknown; purpose?: unknown; projectId?: unknown; stage?: unknown; createdAt?: unknown; updatedAt?: unknown }

export function assembleTask(input: TaskWire): Task {
  return { id: String(input.id ?? ''), purpose: String(input.purpose ?? ''), projectId: String(input.projectId ?? ''), stage: String(input.stage ?? ''), createdAt: typeof input.createdAt === 'string' ? input.createdAt : undefined, updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : undefined }
}
