import {
  checkLlmCliProvider,
  getLlmCliProviderInventory,
  type LlmCliProviderInventory,
} from '~~/layers/office/application/usecases/llm-cli-health'
import type { LlmCliCheckResult } from '~~/layers/office/repositories'

export type LlmCliProviderStatus = 'unknown' | 'checking' | 'connected' | 'unavailable'
export type LlmCliProvider = LlmCliProviderInventory & {
  status: LlmCliProviderStatus
  result?: LlmCliCheckResult
}

type LlmCliHealthState = {
  providers: Ref<LlmCliProvider[]>
  inventoryError: Ref<string>
  checking: Ref<boolean>
  check: (providerId?: string) => Promise<void>
  loadInventory: () => Promise<void>
}

export const useLlmCliHealth = (): LlmCliHealthState => {
  const providers = ref<LlmCliProvider[]>([])
  const inventoryError = ref('')
  const checking = ref(false)
  let inventoryLoadInFlight: Promise<void> | null = null
  const checksInFlight = new Map<string, Promise<void>>()

  const loadInventory = async (): Promise<void> => {
    if (inventoryLoadInFlight) return inventoryLoadInFlight
    inventoryLoadInFlight = (async () => {
      try {
        const inventory = await getLlmCliProviderInventory()
        providers.value = inventory.map((provider) => ({ ...provider, status: 'unknown' }))
        inventoryError.value = ''
      } catch {
        providers.value = []
        inventoryError.value = '無法取得模型服務清單。'
      } finally {
        inventoryLoadInFlight = null
      }
    })()

    return inventoryLoadInFlight
  }

  const checkProvider = (provider: LlmCliProvider): Promise<void> => {
    const current = checksInFlight.get(provider.id)
    if (current) return current
    const modelId = provider.modelId
    if (!modelId) return Promise.resolve()

    provider.status = 'checking'
    const operation = (async () => {
      try {
        const response = await checkLlmCliProvider(provider.id, modelId)
        provider.result = response.data
        provider.status = response.data.available ? 'connected' : 'unavailable'
      } catch {
        provider.result = undefined
        provider.status = 'unknown'
      } finally {
        checksInFlight.delete(provider.id)
      }
    })()

    checksInFlight.set(provider.id, operation)

    return operation
  }

  const check = async (providerId?: string): Promise<void> => {
    await loadInventory()
    const targets = providerId ? providers.value.filter((provider) => provider.id === providerId) : providers.value
    if (!targets.length) return
    checking.value = true
    try {
      await Promise.all(targets.map(checkProvider))
    } finally {
      checking.value = providers.value.some((provider) => provider.status === 'checking')
    }
  }

  return { providers, inventoryError, checking, check, loadInventory }
}
