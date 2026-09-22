/*********************************************
 * 📂 Category: Composables / Plugins
 * 🔧 Defines: 自定 composables、Pinia 狀態、i18n、plugin 等注入來源
 *********************************************/
export const useApiAuth = () => {
  const config = useRuntimeConfig()

  /*********************************************
   * 📂 Category: Refs / Reactive State
   * 🔧 Defines: 元件中的 ref, reactive 等可變資料狀態
   *********************************************/
  const authError = useState<string | null>('nest-api-auth-error', () => null)

  /*********************************************
   * 📂 Category: Computed
   * 🔧 Defines: 定義計算屬性
   *********************************************/
  const accessKey = computed<string>(() => config.public.nestApiKey.trim())

  /*********************************************
   * 📂 Category: Methods
   * 🔧 Defines: 定義函數與事件處理
   *********************************************/
  const requireAccessKey = (): string => {
    if (accessKey.value) return accessKey.value

    authError.value = '尚未設定 Nest client key，請更新前端環境設定並重新啟動服務。'
    throw new Error('Nest client key is required')
  }

  const markUnauthorized = (): void => {
    authError.value = 'Nest client key 無效、已過期或已停用，請確認 client 資料與前端環境設定。'
  }

  return { accessKey, authError, requireAccessKey, markUnauthorized }
}
