/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入 dispatch status 與角色狀態型別
 *********************************************/
import { DispatchStatusEnum } from '~/layers/domain/task/enums/DispatchStatusEnum'
import type { DispatchStatus } from '~/layers/domain/task/types/DispatchStatus'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 角色狀態顯示資料
 *********************************************/
export interface RoleStatusInfo {
  text: string
  icon: string
  className: string
  running: boolean
}

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: dispatch status 對應的顯示資料
 *********************************************/
const waitingStatus: RoleStatusInfo = { text: '等待中', icon: '◷', className: 'is-waiting', running: false }

const statusInfo: Record<DispatchStatus, RoleStatusInfo> = {
  [DispatchStatusEnum.PENDING]: waitingStatus,
  [DispatchStatusEnum.WAITING_DEPENDENCY]: waitingStatus,
  [DispatchStatusEnum.WAITING_CAPACITY]: waitingStatus,
  [DispatchStatusEnum.WAITING_BLOCKER]: { text: '已阻塞', icon: '!', className: 'is-blocked', running: false },
  [DispatchStatusEnum.DISPATCHED]: { text: '工作中', icon: '●', className: 'is-running', running: true },
  [DispatchStatusEnum.COMPLETED]: { text: '已完成', icon: '✓', className: 'is-completed', running: false },
  [DispatchStatusEnum.FAILED]: { text: '失敗', icon: '!', className: 'is-failed', running: false },
  [DispatchStatusEnum.CANCELLED]: { text: '已取消', icon: '!', className: 'is-failed', running: false },
}

const unknownStatus: RoleStatusInfo = { text: '資料未提供', icon: '?', className: 'is-unknown', running: false }

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 將 raw status 轉成角色顯示資料
 *********************************************/
export const getRoleStatusInfo = (value?: string): RoleStatusInfo => {
  if (!value) return unknownStatus

  const matched = Object.entries(statusInfo).find(([status]) => status === value)?.[1]

  return matched ?? { ...unknownStatus, text: value }
}
