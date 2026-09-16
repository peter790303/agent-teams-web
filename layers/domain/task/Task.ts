/*
 * Task is the API task resource shared by office views.
 */
/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義任務資源型別
 *********************************************/
import type { TaskStageEnum } from '~/layers/domain/task/enums/TaskStageEnum'

export interface Task {
  id: string
  purpose: string
  projectId: string
  stage: TaskStageEnum
  createdAt?: string
  updatedAt?: string
}
