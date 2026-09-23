import { request } from '~~/layers/base/repositories/http'

export type LlmCliCheckResult = {
  providerId: string
  modelId?: string
  available: boolean
  latencyMs: number
  errorCode?: string
}

export const checkLlmCli = (providerId: string, modelId?: string): Promise<{ data: LlmCliCheckResult }> =>
  request<unknown>('/llm-cli/check', {
    method: 'POST',
    body: { providerId, ...(modelId === undefined ? {} : { modelId }) },
  }).then((response) => {
    if (!response || typeof response !== 'object' || !('data' in response)) {
      throw new Error('Invalid CLI check response')
    }

    const data = response.data
    if (
      !data ||
      typeof data !== 'object' ||
      !('providerId' in data) ||
      data.providerId !== providerId ||
      ('modelId' in data && data.modelId !== undefined && typeof data.modelId !== 'string') ||
      !('available' in data) ||
      typeof data.available !== 'boolean' ||
      !('latencyMs' in data) ||
      typeof data.latencyMs !== 'number' ||
      !Number.isFinite(data.latencyMs) ||
      data.latencyMs < 0 ||
      ('errorCode' in data && data.errorCode !== undefined && typeof data.errorCode !== 'string')
    ) {
      throw new Error('Invalid CLI check response')
    }

    return { data: data as LlmCliCheckResult }
  })
