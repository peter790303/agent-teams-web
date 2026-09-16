/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 任務執行階段列舉
 *********************************************/
export enum TaskStageEnum {
  PENDING_DISPATCH = 'pending_dispatch',
  SPEC = 'spec',
  PLAN = 'plan',
  IMPLEMENTATION = 'implementation',
  REVIEW = 'review',
  QA = 'qa',
  DELIVERY_CLEANUP = 'delivery_cleanup',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 驗證 API 任務階段
 *********************************************/
export const isTaskStage = (value: unknown): value is TaskStageEnum =>
  typeof value === 'string' && Object.values(TaskStageEnum).some((stage) => stage === value)
