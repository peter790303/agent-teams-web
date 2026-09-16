import type { TaskWire } from './taskAssemblers'
import { useTaskAssemblers } from './taskAssemblers'
import { DispatchStatusEnum } from '../enums/DispatchStatusEnum'
import { isTaskStage } from '../enums/TaskStageEnum'
import type { Dispatch, Execution, Intervention, TaskAction, TaskState } from '../TaskState'

const { toTask } = useTaskAssemblers()
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const asDispatch = (value: unknown): Dispatch => {
  const item = asRecord(value)
  const status = Object.values(DispatchStatusEnum).includes(item.status as DispatchStatusEnum)
    ? (item.status as DispatchStatusEnum)
    : DispatchStatusEnum.PENDING

  return {
    id: String(item.id ?? ''),
    role: String(item.role ?? ''),
    status,
    blockedReasons: Array.isArray(item.blockedReasons) ? item.blockedReasons.map(String) : [],
    dependencies: Array.isArray(item.dependencies) ? item.dependencies.map(String) : [],
    updatedAt: String(item.updatedAt ?? ''),
  }
}

const toTaskState = (value: unknown): TaskState => {
  const item = asRecord(value)
  const data = asRecord(item.data)

  return {
    data: {
      task: toTask(asRecord(data.task) as TaskWire),
      revision: typeof data.revision === 'number' ? data.revision : 0,
      stage: isTaskStage(data.stage) ? data.stage : 'unknown',
      activity: String(data.activity ?? ''),
      updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
      dispatches: Array.isArray(data.dispatches) ? data.dispatches.map(asDispatch) : [],
      executions: Array.isArray(data.executions) ? (data.executions as Execution[]) : [],
      spec: asRecord(data.spec),
      plan: asRecord(data.plan),
      workspace: asRecord(data.workspace),
      qaReport: asRecord(data.qaReport),
      delivery: asRecord(data.delivery),
    },
  }
}

const toIntervention = (value: unknown): Intervention | null => {
  const data = asRecord(value)
  if (Object.keys(data).length === 0) return null

  return {
    status: String(data.status ?? 'unknown'),
    blockers: Array.isArray(data.blockers) ? data.blockers.map(String) : undefined,
    instruction: typeof data.instruction === 'string' ? data.instruction : undefined,
    worktree: typeof data.worktree === 'string' ? data.worktree : undefined,
    processId: typeof data.processId === 'string' ? data.processId : undefined,
    preview: typeof data.preview === 'string' ? data.preview : undefined,
    automaticWriting: typeof data.automaticWriting === 'string' ? data.automaticWriting : undefined,
    round: typeof data.round === 'number' ? data.round : undefined,
    branch: typeof data.branch === 'string' ? data.branch : undefined,
    commit: typeof data.commit === 'string' ? data.commit : undefined,
    evidence: data.evidence,
    diagnostics: data.diagnostics,
    extraReviewRoundAllowance:
      typeof data.extraReviewRoundAllowance === 'string' ? data.extraReviewRoundAllowance : undefined,
  }
}

const toTaskAction = (value: unknown): TaskAction => ({ data: asRecord(asRecord(value).data) })

export const useTaskStateAssemblers = (): {
  toTaskState: typeof toTaskState
  toIntervention: typeof toIntervention
  toTaskAction: typeof toTaskAction
} => ({ toTaskState, toIntervention, toTaskAction })
