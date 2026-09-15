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
    try { tasks.value = (await listTasks()).data; error.value = null }
    catch (reason) { error.value = reason instanceof Error ? reason.message : '載入任務失敗' }
    const states = await Promise.allSettled(tasks.value.map((task) => getTaskState({ id: task.id })))
    taskStates.value = states.flatMap((result) => result.status === 'fulfilled' ? [result.value] : [])
  }
  const create = async (purpose: string, projectId: string): Promise<void> => {
    try { await createTask({ purpose, projectId }); await load() }
    catch (reason) { error.value = reason instanceof Error ? reason.message : '建立任務失敗'; throw reason }
  }
  const getState = (id: string): Promise<TaskState> => getTaskState({ id })
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
  const resumeWithReviewContext = (command: ResumeTaskCommand): Promise<unknown> => resumeTask(command)
  const submitWithKey = (command: SubmitTaskCommand): Promise<unknown> => submitTask(command)
  return { tasks, taskStates, roleStatuses, error, load, create, getState, getIntervention: (id: string) => getIntervention({ id }), resumeTask: resumeWithReviewContext, submitTask: submitWithKey }
}
