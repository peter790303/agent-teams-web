/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import type { ModelCandidate } from '../types'
import type { SavePolicyPayload } from '../types/api'

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 定義函數與事件處理
 *********************************************/

const toPolicyPayload = (whitelist: ModelCandidate[], minQualityScore: number): SavePolicyPayload => ({
  minQualityScore,
  whitelist,
})

export const useModelSettingsMappers = (): { toPolicyPayload: typeof toPolicyPayload } => ({ toPolicyPayload })
