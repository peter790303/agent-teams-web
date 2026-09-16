/*********************************************
 * 📂 Category: Interface
 * 🔧 Defines: API 驗證錯誤型別
 *********************************************/
export type ApiAuthErrorCode = 'missing-access-key' | 'unauthorized'

export class ApiAuthError extends Error {
  constructor(public readonly code: ApiAuthErrorCode) {
    super(code === 'unauthorized' ? 'Nest API access key is unauthorized' : 'Nest API access key is required')
    this.name = 'ApiAuthError'
  }
}

/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 共用 HTTP 請求方法
 *********************************************/
export const request = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
  const config = useRuntimeConfig()
  const { requireAccessKey, markUnauthorized } = useApiAuth()
  const accessKey = requireAccessKey()

  try {
    return await $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${accessKey}`,
      },
    })
  } catch (reason) {
    if (getStatusCode(reason) === 401 && !isProviderUnauthorized(reason)) {
      markUnauthorized()
      throw new ApiAuthError('unauthorized')
    }

    throw reason
  }
}

const getStatusCode = (reason: unknown): number | undefined => {
  if (!isRecord(reason)) return undefined

  const response = isRecord(reason.response) ? reason.response : undefined
  const statuses = [reason.statusCode, reason.status, response?.status]

  return statuses.find((status): status is number => typeof status === 'number')
}

const isProviderUnauthorized = (reason: unknown): boolean => {
  if (!isRecord(reason)) return false

  const response = isRecord(reason.response) ? reason.response : undefined
  const data = isRecord(reason.data)
    ? reason.data
    : response && isRecord(response.data)
      ? response.data
      : response && isRecord(response._data)
        ? response._data
        : undefined

  return data?.code === 'MODEL_PROVIDER_UNAUTHORIZED'
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
