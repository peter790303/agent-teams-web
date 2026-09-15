export type Role = 'leader' | 'pm' | 'rd_leader' | 'rd' | 'qa'

export const MODEL_ROLES: readonly Role[] = ['leader', 'pm', 'rd_leader', 'rd', 'qa']

export type { Task } from '../task/Task'
export type { Model } from '../model/Model'
