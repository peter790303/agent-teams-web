export async function request<T>(path: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  return $fetch<T>(`/api${path}`, { ...options })
}
