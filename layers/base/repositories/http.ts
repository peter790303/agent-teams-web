/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 共用 HTTP 請求方法
 *********************************************/
export const request = async <T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) => {
  const config = useRuntimeConfig()
  const { accessKey, authError, markUnauthorized } = useApiAuth()

  if (!accessKey.value) {
    const message = '請先輸入 Nest API access key。'
    authError.value = message
    throw new Error(message)
  }

  try {
    return await $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${accessKey.value}`,
      },
    })
  } catch (reason) {
    const statusCode =
      typeof reason === 'object' && reason !== null
        ? (reason as { statusCode?: unknown; status?: unknown }).statusCode ??
          (reason as { statusCode?: unknown; status?: unknown }).status
        : undefined
    if (statusCode === 401) markUnauthorized()

    throw reason
  }
}
