import { getTaskState, listTasks, createTask } from '~/repositories/tasks'
export function useOffice() {
  const tasks = useState('tasks', () => [] as Awaited<ReturnType<typeof listTasks>>['data'])
  const load = async () => { tasks.value = (await listTasks()).data }
  return { tasks, load, create: async (purpose: string) => { const result = await createTask(purpose); await load(); return result } , getTaskState }
}
