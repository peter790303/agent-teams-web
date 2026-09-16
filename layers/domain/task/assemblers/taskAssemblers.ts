/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 任務領域型別
 *********************************************/
import { isTaskStage } from '../enums/TaskStageEnum'
import type { Task } from '../Task'

/*********************************************
 * 📂 Category: Interface
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
    stage: isTaskStage(input.stage) ? input.stage : 'unknown',
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : undefined,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : undefined,
  }
}

export const useTaskAssemblers = (): { toTask: (input: TaskWire) => Task } => ({ toTask })
