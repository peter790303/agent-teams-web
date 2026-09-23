import { getCatalog } from '~~/layers/model-settings/repositories'

import { checkLlmCli } from '../../repositories/llm-cli-health'

export type LlmCliProviderInventory = {
  id: string
  name: string
  modelId: string | null
}

const providerNames: Record<string, string> = { anthropic: 'Anthropic', openai: 'OpenAI', agy: 'agy', xai: 'xAI' }

export const getLlmCliProviderInventory = async (): Promise<LlmCliProviderInventory[]> => {
  const catalog = await getCatalog()
  const providers = new Map<string, string | null>()

  for (const entry of catalog) {
    if (typeof entry.providerId !== 'string' || !entry.providerId.trim()) continue
    if (!providers.has(entry.providerId)) providers.set(entry.providerId, null)
    if (providers.get(entry.providerId) === null && typeof entry.modelId === 'string' && entry.modelId.trim()) {
      providers.set(entry.providerId, entry.modelId)
    }
  }

  return [...providers].map(([id, modelId]) => ({
    id,
    name: providerNames[id.toLowerCase()] ?? id,
    modelId,
  }))
}

export const checkLlmCliProvider = (
  providerId: string,
  modelId: string,
): Promise<Awaited<ReturnType<typeof checkLlmCli>>> => checkLlmCli(providerId, modelId)
