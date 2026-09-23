import { getCatalog } from '~~/layers/model-settings/repositories'
import { checkLlmCliHealth, type LlmCliHealthResponse } from '~~/layers/office/repositories'
type ProviderInventoryItem = { id: string; name: string; models: string[] }

type LlmCliHealthState = {
  status: Ref<string | 'unchecked' | 'checking'>
  checkedAt: Ref<string | null>
  providers: Ref<LlmCliHealthResponse['providers']>
  inventory: Ref<ProviderInventoryItem[]>
  inventoryError: Ref<string>
  message: Ref<string>
  check: () => Promise<void>
  loadInventory: () => Promise<void>
}

export const useLlmCliHealth = (): LlmCliHealthState => {
  const status = ref<string | 'unchecked' | 'checking'>('unchecked')
  const checkedAt = ref<string | null>(null)
  const providers = ref<LlmCliHealthResponse['providers']>([])
  const inventory = ref<ProviderInventoryItem[]>([])
  const inventoryError = ref('')
  const message = ref('尚未檢查 CLI 連線。')
  let checkInFlight: Promise<LlmCliHealthResponse> | null = null
  let inventoryLoadInFlight: Promise<void> | null = null

  const loadInventory = async (): Promise<void> => {
    if (inventoryLoadInFlight) return inventoryLoadInFlight
    inventoryLoadInFlight = (async () => {
      try {
        const catalog = await getCatalog()
        const grouped = new Map<string, Set<string>>()
        for (const entry of catalog) {
          if (!entry.providerId) continue
          const models = grouped.get(entry.providerId) ?? new Set<string>()
          if (entry.modelId) models.add(entry.modelId)
          grouped.set(entry.providerId, models)
        }
        const labels: Record<string, string> = { anthropic: 'Anthropic', openai: 'OpenAI', agy: 'agy', xai: 'xAI' }
        inventory.value = [...grouped].map(([id, models]) => ({
          id,
          name: labels[id.toLowerCase()] ?? id,
          models: [...models],
        }))
        inventoryError.value = ''
      } catch (error) {
        inventory.value = []
        inventoryError.value = error instanceof Error ? error.message : '無法取得模型服務清單。'
      } finally {
        inventoryLoadInFlight = null
      }
    })()

    return inventoryLoadInFlight
  }

  const check = async (): Promise<void> => {
    if (checkInFlight) return

    status.value = 'checking'
    message.value = '正在送出不含專案資料的最小 CLI 請求…'
    checkInFlight = checkLlmCliHealth()
    try {
      const result = await checkInFlight
      status.value = result.status
      checkedAt.value = result.checkedAt
      message.value = result.message
      providers.value = result.providers
    } catch (error) {
      status.value = 'unavailable'
      checkedAt.value = new Date().toISOString()
      providers.value = []
      message.value = error instanceof Error ? error.message : 'CLI 連線檢查失敗。'
    } finally {
      checkInFlight = null
    }
  }

  return { status, checkedAt, providers, inventory, inventoryError, message, check, loadInventory }
}
