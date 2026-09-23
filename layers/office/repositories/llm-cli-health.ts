import { request } from '~~/layers/base/repositories/http'

export type LlmCliHealthResponse = {
  status: string
  checkedAt: string
  message: string
  providers: {
    id: string
    name?: string
    model?: string
    cli?: string
    status: string
    checkedAt?: string
    error?: string
  }[]
}

export const checkLlmCliHealth = (): Promise<LlmCliHealthResponse> =>
  request<LlmCliHealthResponse>('/llm-cli-health/check', { method: 'POST' })
