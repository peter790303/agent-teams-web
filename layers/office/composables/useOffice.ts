import { createTask, getIntervention, getTaskState, listTasks, resumeTask, submitTask } from '~/layers/office/repositories'
import type { Task, TaskState } from '~/layers/office/types'

// 📂 Category: office application view model
interface ResumeTaskCommand { id: string; instruction: string; worktree: string; failedReviewRounds: number; extraReviewRoundAllowance: string }
interface SubmitTaskCommand { id: string; worktree: string; commit: string; gate: string; idempotencyKey: string }
const statusLabel = (status: string): string => ({ running: '執行中', active: '執行中', completed: '已完成', succeeded: '已完成', failed: '失敗', blocked: '已阻塞', pending: '等待中' })[status.toLowerCase()] ?? status

export function useOffice() {
  const tasks = useState<Task[]>('tasks', () => [])
  const taskStates = useState<TaskState[]>('task-states', () => [])
  const error = useState<string | null>('tasks-error', () => null)
  const load = async (): Promise<void> => {
    const taskResult = await listTasks()
    if (taskResult.data) { tasks.value = taskResult.data; error.value = null } else error.value = taskResult.error ?? '載入任務失敗'
    const states = await Promise.allSettled(tasks.value.map((task) => getTaskState({ id: task.id })))
    taskStates.value = states.flatMap((result) => result.status === 'fulfilled' && result.value.data ? [result.value.data] : [])
  }
  const create = async (purpose: string, projectId: string): Promise<void> => {
    const result = await createTask({ purpose, projectId })
    if (result.data) await load()
    else error.value = result.error ?? '建立任務失敗'
  }
  const getState = async (id: string): Promise<TaskState> => {
    const result = await getTaskState({ id })
    if (result.data) return result.data
    throw new Error(result.error ?? '載入任務狀態失敗')
  }
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
  const resumeWithReviewContext = async (command: ResumeTaskCommand): Promise<void> => { const result = await resumeTask(command); if (!result.data) throw new Error(result.error ?? '接手任務失敗') }
  const submitWithKey = async (command: SubmitTaskCommand): Promise<void> => { const result = await submitTask(command); if (!result.data) throw new Error(result.error ?? '提交任務失敗') }
  const intervention = async (id: string): Promise<{ data: import('~/layers/office/types').Intervention | null }> => { const result = await getIntervention({ id }); if (result.error) throw new Error(result.error); return { data: result.data } }
  return { tasks, taskStates, roleStatuses, error, load, create, getState, getIntervention: intervention, resumeTask: resumeWithReviewContext, submitTask: submitWithKey }
}
