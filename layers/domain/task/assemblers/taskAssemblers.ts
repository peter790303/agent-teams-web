/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 任務領域型別
 *********************************************/
import type { Task } from '../Task'

/*********************************************
 * 📂 Category: Interfaces
 * 🔧 Defines: 任務 API 輸入型別
 *********************************************/
export interface TaskWire {
  id?: unknown
  purpose?: unknown
  projectId?: unknown
  stage?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 將 API 輸入轉為領域任務
 *********************************************/
const toTask = (input: TaskWire): Task => {
  return {
    id: String(input.id ?? ''),
    purpose: String(input.purpose ?? ''),
    projectId: String(input.projectId ?? ''),
    stage: String(input.stage ?? ''),
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : undefined,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : undefined,
  }
}

export const useTaskAssemblers = (): { toTask: (input: TaskWire) => Task } => ({ toTask })
