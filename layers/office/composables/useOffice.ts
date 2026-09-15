import { createTask, getIntervention, getTaskState, listTasks, resumeTask, submitTask } from '~/layers/office/repositories'
import type { Task, TaskState } from '~/layers/office/types'

export function useOffice() {
  const tasks = useState<Task[]>('tasks', () => [])
  const error = useState<string | null>('tasks-error', () => null)
  const load = async (): Promise<void> => {
    try { tasks.value = (await listTasks()).data; error.value = null }
    catch (reason) { error.value = reason instanceof Error ? reason.message : '載入任務失敗' }
  }
  const create = async (purpose: string, projectId: string): Promise<void> => { await createTask(purpose, projectId); await load() }
  const getState = (id: string): Promise<TaskState> => getTaskState(id)
  return { tasks, error, load, create, getState, getIntervention, resumeTask, submitTask }
}
