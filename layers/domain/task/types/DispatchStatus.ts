/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入 dispatch status enum
 *********************************************/
import type { DispatchStatusEnum } from '~/layers/domain/task/enums/DispatchStatusEnum'

/*********************************************
 * 📂 Category: Type
 * 🔧 Defines: dispatch status 的型別聯集
 *********************************************/
export type DispatchStatus = `${DispatchStatusEnum}`
