/*********************************************
 * 📂 Category: Methods
 * 🔧 Defines: 共用 HTTP 請求方法
 *********************************************/
export async function request<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  const config = useRuntimeConfig()
  return $fetch<T>(`${config.public.apiBase}${path}`, { ...options })
}
