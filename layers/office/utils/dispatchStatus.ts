/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import { DispatchStatusEnum } from '~/layers/domain/task/enums/DispatchStatusEnum'
import type { DispatchStatus } from '~/layers/domain/task/types/DispatchStatus'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
export interface RoleStatusInfo {
  text: string
  icon: string
  className: string
  running: boolean
}

/*********************************************
 * 📂 Category: Static Data
 * 🔧 Defines: 不會改變的靜態資料，例如選單、enum 對應等
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
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/
export const getRoleStatusInfo = (value?: string): RoleStatusInfo => {
  if (!value) return unknownStatus

  const matched = Object.entries(statusInfo).find(([status]) => status === value)?.[1]

  return matched ?? { ...unknownStatus, text: value }
}
