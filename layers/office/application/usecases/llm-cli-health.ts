import { getCatalog } from '~~/layers/model-settings/repositories'

import { checkLlmCli } from '../../repositories/llm-cli-health'

export type LlmCliProviderInventory = {
  id: string
  name: string
}

const providerNames: Record<string, string> = { anthropic: 'Anthropic', openai: 'OpenAI', agy: 'agy', xai: 'xAI' }

export const getLlmCliProviderInventory = async (): Promise<LlmCliProviderInventory[]> => {
  const catalog = await getCatalog()
  const providers = new Set<string>()

  for (const entry of catalog) {
    if (typeof entry.providerId !== 'string' || !entry.providerId.trim()) continue
    providers.add(entry.providerId)
  }

  return [...providers].map((id) => ({
    id,
    name: providerNames[id.toLowerCase()] ?? id,
  }))
}

export const checkLlmCliProvider = (providerId: string): Promise<Awaited<ReturnType<typeof checkLlmCli>>> =>
  checkLlmCli(providerId)
