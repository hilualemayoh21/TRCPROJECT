import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ZodType } from 'zod'
import { z } from 'zod'
import { api as realApi, USE_MOCK_API } from './api'
import { mockApi } from '@/mocks/mock.api'
import {
  AssignRoleResponseSchema,
  AuthResponseSchema,
  PaginatedUsersSchema,
  RefreshResponseSchema,
  RolePermissionToggleSchema,
  RoleSchema,
  UserSchema
} from './api.schemas'

type ApiLike = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
}

const useMockApi = USE_MOCK_API
const activeApi: ApiLike = useMockApi ? mockApi : (realApi as ApiLike)

if (useMockApi) {
  // Helpful runtime signal in development/test
  console.info('[API Adapter] Mock API enabled via VITE_USE_MOCK_API=true')
}

type ValidationRule = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  pattern: RegExp
  schema: ZodType<unknown>
}

const responseValidationRules: ValidationRule[] = [
  { method: 'POST', pattern: /^\/auth\/login$/, schema: AuthResponseSchema },
  { method: 'POST', pattern: /^\/auth\/register$/, schema: AuthResponseSchema },
  { method: 'POST', pattern: /^\/auth\/refresh$/, schema: RefreshResponseSchema },
  { method: 'GET', pattern: /^\/auth\/me$/, schema: UserSchema },
  { method: 'GET', pattern: /^\/roles$/, schema: RoleSchema.array() },
  { method: 'POST', pattern: /^\/roles$/, schema: RoleSchema },
  { method: 'PATCH', pattern: /^\/roles\/[^/]+$/, schema: RoleSchema },
  { method: 'DELETE', pattern: /^\/roles\/[^/]+$/, schema: z.object({ ok: z.boolean() }) },
  { method: 'GET', pattern: /^\/admin\/users$/, schema: PaginatedUsersSchema },
  { method: 'PATCH', pattern: /^\/admin\/users\/[^/]+\/status$/, schema: UserSchema },
  { method: 'POST', pattern: /^\/users\/[^/]+\/roles$/, schema: AssignRoleResponseSchema },
  { method: 'POST', pattern: /^\/roles\/[^/]+\/permissions$/, schema: RolePermissionToggleSchema },
  { method: 'DELETE', pattern: /^\/roles\/[^/]+\/permissions$/, schema: RolePermissionToggleSchema }
]

export class ApiResponseValidationError extends Error {
  code = 'API_RESPONSE_VALIDATION_ERROR'
  details: unknown

  constructor(message: string, details: unknown) {
    super(message)
    this.name = 'ApiResponseValidationError'
    this.details = details
  }
}

function normalizePath(url: string): string {
  return url.split('?')[0]
}

function extractData(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as Record<string, unknown>).data
  }
  return payload
}

function validateResponse(method: ValidationRule['method'], url: string, responseData: unknown) {
  const path = normalizePath(url)
  const rule = responseValidationRules.find((entry) => entry.method === method && entry.pattern.test(path))
  if (!rule) return

  const candidate = extractData(responseData)
  const result = rule.schema.safeParse(candidate)
  if (!result.success) {
    throw new ApiResponseValidationError(`Invalid API response for ${method} ${path}`, {
      method,
      path,
      issues: result.error.issues
    })
  }
}

export const api: ApiLike = {
  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await activeApi.get<T>(url, config)
    validateResponse('GET', url, response.data)
    return response
  },
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await activeApi.post<T>(url, data, config)
    validateResponse('POST', url, response.data)
    return response
  },
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await activeApi.patch<T>(url, data, config)
    validateResponse('PATCH', url, response.data)
    return response
  },
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await activeApi.delete<T>(url, config)
    validateResponse('DELETE', url, response.data)
    return response
  }
}

