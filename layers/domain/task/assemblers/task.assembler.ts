import type { Task } from '../Task'

export function assembleTask(input: Task): Task {
  return { ...input }
}
