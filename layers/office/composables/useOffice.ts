/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import { DispatchStatusEnum } from '~/layers/domain/task/enums/DispatchStatusEnum'
import { isTaskStage, TaskStageEnum } from '~/layers/domain/task/enums/TaskStageEnum'
import type { DispatchStatus } from '~/layers/domain/task/types/DispatchStatus'
import {
  createTask,
  getIntervention,
  getTaskState,
  listTasks,
  resumeTask,
  submitTask,
} from '~/layers/office/repositories'
import { OfficeLoadStatusEnum } from '~/layers/office/types'
import type {
  Intervention,
  OfficeComposable,
  ResumeTaskCommand,
  SubmitTaskCommand,
  Task,
  TaskState,
} from '~/layers/office/types'

export const useOffice = (): OfficeComposable => {
  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
   *********************************************/
  const tasks = useState<Task[]>('tasks', () => [])
  const taskLoadStatus = useState<OfficeLoadStatusEnum>('tasks-load-status', () => OfficeLoadStatusEnum.IDLE)
  const taskStates = useState<TaskState[]>('task-states', () => [])
  const error = useState<string | null>('tasks-error', () => null)

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const roleStatuses = computed<Record<string, DispatchStatus>>(() => {
    const statuses = taskStates.value.reduce<Record<string, DispatchStatus>>((next, state) => {
      return state.data.dispatches.reduce<Record<string, DispatchStatus>>((nextStatuses, dispatch) => {
        const next = dispatch.status
        const previous = nextStatuses[dispatch.role]
        const running = dispatch.status === DispatchStatusEnum.DISPATCHED
        const previousRunning = previous === DispatchStatusEnum.DISPATCHED
        if (previous === undefined || running || !previousRunning) nextStatuses[dispatch.role] = next

        return nextStatuses
      }, next)
    }, {})
    const stageRoles: Partial<Record<TaskStageEnum, string>> = {
      [TaskStageEnum.SPEC]: 'pm',
      [TaskStageEnum.PLAN]: 'rd_leader',
      [TaskStageEnum.IMPLEMENTATION]: 'rd',
      [TaskStageEnum.REVIEW]: 'review',
      [TaskStageEnum.QA]: 'qa',
      [TaskStageEnum.DELIVERY_CLEANUP]: 'delivery',
    }

    return taskStates.value.reduce<Record<string, DispatchStatus>>((next, state) => {
      const role = isTaskStage(state.data.stage) ? stageRoles[state.data.stage] : undefined
      if (role && next[role] === undefined) next[role] = DispatchStatusEnum.DISPATCHED

      return next
    }, statuses)
  })

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const setError = (message: string | null): void => {
    error.value = message
  }
  const load = async (): Promise<void> => {
    taskLoadStatus.value = OfficeLoadStatusEnum.LOADING
    setError(null)
    const taskResult = await listTasks()
    if (taskResult.error) {
      tasks.value = []
      taskStates.value = []
      setError(taskResult.error)
      taskLoadStatus.value = OfficeLoadStatusEnum.ERROR

      return
    }
    if (!taskResult.data) {
      tasks.value = []
      taskStates.value = []
      setError('載入任務失敗')
      taskLoadStatus.value = OfficeLoadStatusEnum.ERROR

      return
    }
    tasks.value = taskResult.data
    taskLoadStatus.value = OfficeLoadStatusEnum.SUCCESS
    const states = await Promise.allSettled(tasks.value.map((task) => getTaskState({ id: task.id })))
    const stateErrors = states.flatMap((result) =>
      result.status === 'rejected'
        ? [result.reason instanceof Error ? result.reason.message : '載入任務狀態失敗']
        : result.value.error
          ? [result.value.error]
          : []
    )
    taskStates.value = states.flatMap((result) =>
      result.status === 'fulfilled' && result.value.data ? [result.value.data] : []
    )
    setError(stateErrors.length > 0 ? stateErrors.join('；') : null)
  }
  const create = async (purpose: string, projectId: string): Promise<void> => {
    const result = await createTask({ purpose, projectId })
    if (result.error) {
      setError(result.error)

      return
    }
    if (result.data) {
      await load()

      return
    }
    setError('建立任務失敗')
  }
  const getState = async (id: string): Promise<TaskState> => {
    const result = await getTaskState({ id })
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
    if (result.data) return result.data
    const message = '載入任務狀態失敗'
    setError(message)
    throw new Error(message)
  }
  const resumeWithReviewContext = async (command: ResumeTaskCommand): Promise<void> => {
    const result = await resumeTask(command)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
    if (result.data) return
    const message = '接手任務失敗'
    setError(message)
    throw new Error(message)
  }
  const submitWithKey = async (command: SubmitTaskCommand): Promise<void> => {
    const result = await submitTask(command)
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }
    if (result.data) return
    const message = '提交任務失敗'
    setError(message)
    throw new Error(message)
  }
  const intervention = async (id: string): Promise<{ data: Intervention | null }> => {
    const result = await getIntervention({ id })
    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }

    return { data: result.data }
  }

  return {
    tasks,
    taskLoadStatus,
    taskStates,
    roleStatuses,
    error,
    load,
    create,
    getState,
    getIntervention: intervention,
    resumeTask: resumeWithReviewContext,
    submitTask: submitWithKey,
  }
}
