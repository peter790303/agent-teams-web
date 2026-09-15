/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import { createTask, getIntervention, getTaskState, listTasks, resumeTask, submitTask } from '~/layers/office/repositories'
import type { Intervention, Task, TaskState } from '~/layers/office/types'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
interface ResumeTaskCommand { id: string; instruction: string; worktree: string; failedReviewRounds: number; extraReviewRoundAllowance: string }
interface SubmitTaskCommand { id: string; worktree: string; commit: string; gate: string; idempotencyKey: string }

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
 *********************************************/
const statusLabel = (status: string): string => ({ running: '執行中', active: '執行中', completed: '已完成', succeeded: '已完成', failed: '失敗', blocked: '已阻塞', pending: '等待中' })[status.toLowerCase()] ?? status

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/
export function useOffice() {

/*********************************************
 * 📂 Category: Refs / Reactive State
 * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
 *********************************************/
  const tasks = useState<Task[]>('tasks', () => [])
  const taskStates = useState<TaskState[]>('task-states', () => [])
  const error = useState<string | null>('tasks-error', () => null)

/*********************************************
 * 📂 Category: Computed
 * 🔧 Defines: 定義計算屬性
 *********************************************/
  const roleStatuses = computed<Record<string, string>>(() => taskStates.value.reduce<Record<string, string>>((statuses, state) => {
    state.data.dispatches.forEach((dispatch) => {
      const next = statusLabel(dispatch.status)
      const previous = statuses[dispatch.role]
      const running = /running|執行中|active/i.test(dispatch.status)
      const previousRunning = previous !== undefined && /running|執行中|active/i.test(previous)
      if (previous === undefined || running || !previousRunning) statuses[dispatch.role] = next
    })
    return statuses
  }, {}))

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/
  const setError = (message: string | null): void => { error.value = message }
  const load = async (): Promise<void> => {
    setError(null)
    const taskResult = await listTasks()
    if (taskResult.error) { tasks.value = []; taskStates.value = []; setError(taskResult.error); return }
    if (!taskResult.data) { tasks.value = []; taskStates.value = []; setError('載入任務失敗'); return }
    tasks.value = taskResult.data
    const states = await Promise.allSettled(tasks.value.map((task) => getTaskState({ id: task.id })))
    const stateErrors = states.flatMap((result) => result.status === 'rejected' ? [result.reason instanceof Error ? result.reason.message : '載入任務狀態失敗'] : result.value.error ? [result.value.error] : [])
    taskStates.value = states.flatMap((result) => result.status === 'fulfilled' && result.value.data ? [result.value.data] : [])
    setError(stateErrors.length > 0 ? stateErrors.join('；') : null)
  }
  const create = async (purpose: string, projectId: string): Promise<void> => {
    const result = await createTask({ purpose, projectId })
    if (result.error) { setError(result.error); return }
    if (result.data) { await load(); return }
    setError('建立任務失敗')
  }
  const getState = async (id: string): Promise<TaskState> => {
    const result = await getTaskState({ id })
    if (result.error) { setError(result.error); throw new Error(result.error) }
    if (result.data) return result.data
    const message = '載入任務狀態失敗'
    setError(message)
    throw new Error(message)
  }
  const resumeWithReviewContext = async (command: ResumeTaskCommand): Promise<void> => {
    const result = await resumeTask(command)
    if (result.error) { setError(result.error); throw new Error(result.error) }
    if (result.data) return
    const message = '接手任務失敗'
    setError(message)
    throw new Error(message)
  }
  const submitWithKey = async (command: SubmitTaskCommand): Promise<void> => {
    const result = await submitTask(command)
    if (result.error) { setError(result.error); throw new Error(result.error) }
    if (result.data) return
    const message = '提交任務失敗'
    setError(message)
    throw new Error(message)
  }
  const intervention = async (id: string): Promise<{ data: Intervention | null }> => {
    const result = await getIntervention({ id })
    if (result.error) { setError(result.error); throw new Error(result.error) }
    return { data: result.data }
  }
  return { tasks, taskStates, roleStatuses, error, load, create, getState, getIntervention: intervention, resumeTask: resumeWithReviewContext, submitTask: submitWithKey }
}
