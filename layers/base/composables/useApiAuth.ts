/*********************************************
 * 📂 Category: Composables / Plugins
 * 🔧 Defines: Nest API key 的 session 狀態
 *********************************************/
export const useApiAuth = () => {
  const accessKey = useState<string | null>('nest-api-access-key', () => null)
  const authError = useState<string | null>('nest-api-auth-error', () => null)
  const initialized = useState<boolean>('nest-api-auth-initialized', () => false)

  if (import.meta.client && !initialized.value) {
    accessKey.value = window.sessionStorage.getItem('nest-api-access-key')
    initialized.value = true
  }

  const setAccessKey = (value: string): void => {
    const normalizedValue = value.trim()
    accessKey.value = normalizedValue || null
    authError.value = null

    if (import.meta.client) {
      if (normalizedValue) window.sessionStorage.setItem('nest-api-access-key', normalizedValue)
      else window.sessionStorage.removeItem('nest-api-access-key')
    }
  }

  const clearAccessKey = (): void => {
    accessKey.value = null
    if (import.meta.client) window.sessionStorage.removeItem('nest-api-access-key')
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
    markUnauthorized,
  }
}
