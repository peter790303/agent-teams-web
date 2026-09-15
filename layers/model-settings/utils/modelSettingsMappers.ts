/*********************************************
 * 📂 Category: Imports
 * 🔧 Defines: 引入必要的模組和庫
 *********************************************/

import type { ModelCandidate } from '../types'
import type { SavePolicyPayload } from '../types/api'

/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: Mapper 對外提供的 API payload 轉換介面
 *********************************************/

export interface ModelSettingsMappers {
  toPolicyPayload: (whitelist: ModelCandidate[], minQualityScore: number) => SavePolicyPayload
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: API payload 純轉換函式
 *********************************************/

const toPolicyPayload = (whitelist: ModelCandidate[], minQualityScore: number): SavePolicyPayload => ({
  minQualityScore,
  whitelist,
})

export const useModelSettingsMappers = (): ModelSettingsMappers => ({ toPolicyPayload })
