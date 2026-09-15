import { getQuery, getRouterParam, readBody, getMethod, proxyRequest, setResponseStatus } from 'h3'
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  const config = useRuntimeConfig()
  const target = `${config.backendOrigin}/${path}`
  const method = getMethod(event)
  if (method === 'GET' || method === 'HEAD') return proxyRequest(event, target)
  const body = await readBody(event)
  return $fetch(target, { method, query: getQuery(event), body, headers: { 'content-type': 'application/json' } }).catch((error) => {
    setResponseStatus(event, error?.statusCode || 502)
    return { error: 'backend_unavailable' }
  })
})
