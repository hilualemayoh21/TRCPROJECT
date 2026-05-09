import { del, get, patch, post } from '@/services/http'
import type {
  AdminAuditLog,
  AdminPaginated,
  AdminQuery,
  AdminReport,
  AdminRole,
  AdminUser,
  Permission,
  ResearcherApprovalRequest,
  ResourceApprovalItem,
} from '../types/admin.types'
import { AdminRoleSchema } from '../types/admin.types'

export type UpdateUserPayload = Partial<Pick<AdminUser, 'name' | 'email' | 'role' | 'active'>> & {
  permissions?: Permission[]
}

export type CreateUserPayload = Required<Pick<AdminUser, 'name' | 'email' | 'role'>> & {
  password?: string
  permissions?: Permission[]
}

export const adminApi = {
  // ---- Dashboard / analytics ----
  async getAnalyticsOverview() {
    return get<{
      totalUsers?: number
      totalResources?: number
      pendingApprovals?: number
      recentActivity?: Array<{
        id?: string
        action?: string
        actor?: string
        createdAt?: number
        context?: string
      }>
    }>('/admin/analytics/overview')
  },

  // ---- Users ----
  async listUsers(query: AdminQuery = {}) {
    return get<AdminPaginated<AdminUser>>('/admin/users', { params: query })
  },

  async getUser(id: string) {
    return get<AdminUser>(`/admin/users/${encodeURIComponent(id)}`)
  },

  async createUser(payload: CreateUserPayload) {
    return post<AdminUser>('/admin/users', payload)
  },

  async updateUser(id: string, payload: UpdateUserPayload) {
    return patch<AdminUser>(`/admin/users/${encodeURIComponent(id)}`, payload)
  },

  async setUserActive(id: string, active: boolean) {
    return patch<AdminUser>(`/admin/users/${encodeURIComponent(id)}/status`, { active })
  },

  async deleteUser(id: string) {
    return del(`/admin/users/${encodeURIComponent(id)}`)
  },

  // ---- Roles & permissions (core) ----
  async listRoles() {
    const endpoints = ['/admin/roles', '/roles', '/roles/roles'] as const
    let lastError: unknown

    for (const endpoint of endpoints) {
      try {
        const data = await get<any>(endpoint)
        const candidate = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.roles)
              ? data.roles
              : data
        const result = AdminRoleSchema.array().safeParse(candidate)
        if (!result.success) {
          console.error('[Admin API] listRoles validation failed:', result.error.issues)
          return candidate as AdminRole[] // Fallback to raw data
        }
        return result.data as AdminRole[]
      } catch (e) {
        const status = (e as any)?.status ?? (e as any)?.response?.status
        // 401 means the session/token is invalid; preserve auth behavior.
        if (status === 401) throw e
        lastError = e
      }
    }

    console.error('[Admin API] listRoles network error:', lastError)
    throw lastError
  },

  async createRole(payload: { name: string; description?: string; permissions: Permission[]; isSystem?: boolean }) {
    const data = await post<AdminRole>('/admin/roles', payload)
    return AdminRoleSchema.parse(data) as AdminRole
  },

  async updateRole(id: string, payload: Partial<Pick<AdminRole, 'name' | 'description' | 'permissions'>>) {
    const data = await patch<AdminRole>(`/admin/roles/${encodeURIComponent(id)}`, payload)
    return AdminRoleSchema.parse(data) as AdminRole
  },

  async deleteRole(id: string) {
    return del(`/admin/roles/${encodeURIComponent(id)}`)
  },

  /** Add/remove a single permission via dedicated endpoints (works for system roles; avoids PATCH on protected roles). */
  async addRolePermission(roleId: string, permission: Permission) {
    const id = encodeURIComponent(roleId)
    const paths = [`/admin/roles/${id}/permissions`, `/roles/${id}/permissions`] as const
    let lastError: unknown
    for (const path of paths) {
      try {
        return await post<{ ok: boolean; permissions: string[] }>(path, { permission })
      } catch (e) {
        const status = (e as any)?.status ?? (e as any)?.response?.status
        if (status === 401) throw e
        lastError = e
      }
    }
    throw lastError
  },

  async removeRolePermission(roleId: string, permission: Permission) {
    const id = encodeURIComponent(roleId)
    const paths = [`/admin/roles/${id}/permissions`, `/roles/${id}/permissions`] as const
    let lastError: unknown
    for (const path of paths) {
      try {
        return await del<{ ok: boolean; permissions: string[] }>(path, { data: { permission } })
      } catch (e) {
        const status = (e as any)?.status ?? (e as any)?.response?.status
        if (status === 401) throw e
        lastError = e
      }
    }
    throw lastError
  },

  // ---- Approvals ----
  async listResearcherRequests(query: AdminQuery = {}) {
    return get<AdminPaginated<ResearcherApprovalRequest>>('/admin/researchers/requests', {
      params: query
    })
  },

  async approveResearcher(id: string) {
    return post(`/admin/researchers/${encodeURIComponent(id)}/approve`)
  },

  async rejectResearcher(id: string, reason?: string) {
    return post(`/admin/researchers/${encodeURIComponent(id)}/reject`, { reason })
  },

  async listPendingResources(query: AdminQuery = {}) {
    return get<AdminPaginated<ResourceApprovalItem>>('/admin/resources/pending', {
      params: query
    })
  },

  async approveResource(id: string, note?: string) {
    return post(`/resources/${encodeURIComponent(id)}/approve`, { note })
  },

  async rejectResource(id: string, note?: string) {
    return post(`/resources/${encodeURIComponent(id)}/reject`, { note })
  },

  // ---- Reports ----
  async listReports(query: AdminQuery = {}) {
    return get<AdminPaginated<AdminReport>>('/admin/reports', { params: query })
  },

  async resolveReport(id: string, action: 'resolve' | 'dismiss', note?: string) {
    return post(`/admin/reports/${encodeURIComponent(id)}/resolve`, { action, note })
  },

  // ---- Audit logs ----
  async listAuditLogs(query: AdminQuery = {}) {
    return get<AdminPaginated<AdminAuditLog>>('/admin/audit-logs', { params: query })
  },

  async createAuditLog(payload: { action: string; context?: string }) {
    return post<AdminAuditLog>('/admin/audit-log', payload)
  }
}
