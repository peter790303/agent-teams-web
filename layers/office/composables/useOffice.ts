import { createTask, getIntervention, getTaskState, listTasks, resumeTask, submitTask } from '~/layers/office/repositories'
import type { Task, TaskState } from '~/layers/office/types'

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
  const create = async (purpose: string, projectId: string): Promise<void> => { await createTask({ purpose, projectId }); await load() }
  const getState = (id: string): Promise<TaskState> => getTaskState({ id })
  const roleStatuses = computed<Record<string, string>>(() => taskStates.value.reduce<Record<string, string>>((statuses, state) => {
    state.data.dispatches.forEach((dispatch) => { statuses[dispatch.role] = dispatch.status })
    return statuses
  }, {}))
  const resumeWithReviewContext = (id: string, instruction: string, worktree: string, failedReviewRounds: number, extraReviewRoundAllowance: string): Promise<unknown> =>
    resumeTask({ id, instruction, worktree, failedReviewRounds, extraReviewRoundAllowance })
  return { tasks, taskStates, roleStatuses, error, load, create, getState, getIntervention: (id: string) => getIntervention({ id }), resumeTask: resumeWithReviewContext, submitTask: (id: string, worktree: string, commit: string, gate: string, idempotencyKey: string) => submitTask({ id, worktree, commit, gate, idempotencyKey }) }
}
