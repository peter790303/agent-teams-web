/** Dispatch lifecycle values returned by the Nest scheduler. */
export enum DispatchStatusEnum {
  PENDING = 'pending',
  WAITING_DEPENDENCY = 'waiting_dependency',
  WAITING_CAPACITY = 'waiting_capacity',
  WAITING_BLOCKER = 'waiting_blocker',
  DISPATCHED = 'dispatched',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export type DispatchStatus = `${DispatchStatusEnum}`
