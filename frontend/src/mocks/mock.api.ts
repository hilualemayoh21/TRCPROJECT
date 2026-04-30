import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { handleMockRequest } from './handlers'
import { mockDb } from './db'

export type MockApiResponse<T> = AxiosResponse<T>

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomDelay() {
  return 300 + Math.floor(Math.random() * 501)
}

function withQuery(url: string, params?: Record<string, unknown>) {
  if (!params || Object.keys(params).length === 0) return url
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    query.set(key, String(value))
  }
  const q = query.toString()
  return q ? `${url}?${q}` : url
}

function toHeaders(config?: AxiosRequestConfig): Record<string, unknown> {
  const headers = config?.headers || {}
  if (typeof headers !== 'object' || headers === null) return {}
  return headers as Record<string, unknown>
}

function toResponse<T>(data: T, config?: AxiosRequestConfig, status = 200): MockApiResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: (config || {}) as any
  }
}

function toRejectedError(err: any, config?: AxiosRequestConfig) {
  const status = Number(err?.status || 500)
  const message = String(err?.message || 'Mock API Error')
  const payload = { message }

  return {
    message,
    response: {
      status,
      data: payload,
      statusText: status >= 500 ? 'Server Error' : 'Error',
      headers: {},
      config: (config || {}) as any
    }
  }
}

async function run<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<MockApiResponse<T>> {
  await delay(randomDelay())
  if (mockDb.simulation.forceNetworkError) {
    throw { message: 'Network error. Please check your connection.' }
  }
  try {
    const payload = handleMockRequest({
      method,
      url,
      data,
      params: (config?.params || {}) as Record<string, unknown>,
      headers: toHeaders(config)
    }) as T
    return toResponse(payload, config)
  } catch (err: any) {
    throw toRejectedError(err, config)
  }
}

export const mockApi = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return run<T>('GET', withQuery(url, config?.params as Record<string, unknown>), undefined, config)
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return run<T>('POST', url, data, config)
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return run<T>('PATCH', url, data, config)
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    const body = (config?.data || {}) as unknown
    return run<T>('DELETE', url, body, config)
  }
}

