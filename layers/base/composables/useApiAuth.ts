/*********************************************
 * 📂 Category: Composables / Plugins
 * 🔧 Defines: Nest API key 的 session 狀態
 *********************************************/
const ACCESS_KEY_STORAGE = 'nest-api-access-key'

export const useApiAuth = () => {
  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: API key 與驗證錯誤狀態
   *********************************************/
  const accessKey = useState<string | null>('nest-api-access-key', () => null)
  const authError = useState<string | null>('nest-api-auth-error', () => null)
  const initialized = useState<boolean>('nest-api-auth-initialized', () => false)

  if (import.meta.client && !initialized.value) {
    accessKey.value = window.sessionStorage.getItem(ACCESS_KEY_STORAGE)
    initialized.value = true
  }

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: API key 儲存與驗證狀態轉換
   *********************************************/
  const setAccessKey = (value: string): void => {
    const normalizedValue = value.trim()
    accessKey.value = normalizedValue || null
    authError.value = null

    if (import.meta.client) {
      if (normalizedValue) window.sessionStorage.setItem(ACCESS_KEY_STORAGE, normalizedValue)
      else window.sessionStorage.removeItem(ACCESS_KEY_STORAGE)
    }
  }

  const clearAccessKey = (): void => {
    accessKey.value = null
    if (import.meta.client) window.sessionStorage.removeItem(ACCESS_KEY_STORAGE)
  }

  const requireAccessKey = (): string => {
    if (accessKey.value) return accessKey.value

    authError.value = '請先輸入 Nest API access key。'
    throw new Error('Nest API access key is required')
  }

  const markUnauthorized = (): void => {
    clearAccessKey()
    authError.value = 'Nest API key 無效或已過期，請重新輸入。'
  }

  return {
    accessKey,
    authError,
    setAccessKey,
    clearAccessKey,
    requireAccessKey,
    markUnauthorized,
  }
}
