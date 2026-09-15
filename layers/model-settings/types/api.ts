/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/
import type { Role } from '~/layers/domain/types'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義元件內使用的自訂 TypeScript 型別
 *********************************************/
export interface SavePolicyPayload { minQualityScore: number; whitelist: unknown[] }
export type ModelRole = Role
