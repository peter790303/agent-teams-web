import { DispatchStatusEnum, type DispatchStatus } from '~/layers/domain/task/enums/DispatchStatusEnum'

export interface RoleStatusInfo {
  text: string
  icon: string
  className: string
  running: boolean
}

const statusInfo: Record<DispatchStatus, RoleStatusInfo> = {
  [DispatchStatusEnum.PENDING]: { text: '等待中', icon: '◷', className: 'is-waiting', running: false },
  [DispatchStatusEnum.WAITING_DEPENDENCY]: { text: '等待中', icon: '◷', className: 'is-waiting', running: false },
  [DispatchStatusEnum.WAITING_CAPACITY]: { text: '等待中', icon: '◷', className: 'is-waiting', running: false },
  [DispatchStatusEnum.WAITING_BLOCKER]: { text: '已阻塞', icon: '!', className: 'is-blocked', running: false },
  [DispatchStatusEnum.DISPATCHED]: { text: '工作中', icon: '●', className: 'is-running', running: true },
  [DispatchStatusEnum.COMPLETED]: { text: '已完成', icon: '✓', className: 'is-completed', running: false },
  [DispatchStatusEnum.FAILED]: { text: '失敗', icon: '!', className: 'is-failed', running: false },
  [DispatchStatusEnum.CANCELLED]: { text: '已取消', icon: '!', className: 'is-failed', running: false },
}

const unknownStatus: RoleStatusInfo = { text: '資料未提供', icon: '?', className: 'is-unknown', running: false }

export const getRoleStatusInfo = (value?: string): RoleStatusInfo => {
  if (!value) return unknownStatus

  return statusInfo[value as DispatchStatus] ?? { ...unknownStatus, text: value }
}
