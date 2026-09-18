/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: 定義模型設定領域模型
 *********************************************/

import type { Model } from '../model/Model'
import type { Role } from '../types'

export interface PolicyData {
  role: Role
  whitelist: Model[]
  minQualityScore?: number
  version: number
  updatedAt: string
}

export interface Policy {
  data: PolicyData
}

export interface HealthEntry {
  providerId: string
  targetAccountId: string | null
  sourceGranularity: string
  authStatus: string
  callHealth: string
  quota: {
    status: string
    amount: number | null
    unit: string | null
    isEstimated: boolean
    estimatedReason: string | null
  }
  affectedModels: string[]
  observedAt: string
  isStale: boolean
  consecutiveFailures: number
}

export interface Capacity {
  role: Role
  initialCapacity: number
  currentCapacity: number
  maxCapacity: number
  activeCount: number
  availableCapacity: number
  updatedAt: string
}

export interface ModelCatalog {
  providerId: string
  modelId: string
  capabilities: string[]
  qualityScore: number
  costScore: number
  latencyScore: number
}
