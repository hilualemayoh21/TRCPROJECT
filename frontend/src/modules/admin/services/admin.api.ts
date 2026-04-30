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
  AdminRoleSchema,
} from '../types/admin.types'

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
        createdAt?: string
        context?: string
      }>
    }>('/analytics/overview')
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
    const data = await get<AdminRole[]>('/roles')
    return AdminRoleSchema.array().parse(data) as AdminRole[]
  },

  async createRole(payload: { name: string; description?: string; permissions: Permission[]; isSystem?: boolean }) {
    const data = await post<AdminRole>('/roles', payload)
    return AdminRoleSchema.parse(data) as AdminRole
  },

  async updateRole(id: string, payload: Partial<Pick<AdminRole, 'name' | 'description' | 'permissions'>>) {
    const data = await patch<AdminRole>(`/roles/${encodeURIComponent(id)}`, payload)
    return AdminRoleSchema.parse(data) as AdminRole
  },

  async deleteRole(id: string) {
    return del(`/roles/${encodeURIComponent(id)}`)
  },

  // ---- Approvals ----
  async listResearcherRequests(query: AdminQuery = {}) {
    return get<AdminPaginated<ResearcherApprovalRequest>>('/admin/researchers/requests', {
      params: query
    })
  },

  async approveResearcher(id: string) {
    return post(`/admin/researchers/requests/${encodeURIComponent(id)}/approve`)
  },

  async rejectResearcher(id: string, reason?: string) {
    return post(`/admin/researchers/requests/${encodeURIComponent(id)}/reject`, { reason })
  },

  async listPendingResources(query: AdminQuery = {}) {
    return get<AdminPaginated<ResourceApprovalItem>>('/admin/resources/pending', {
      params: query
    })
  },

  async approveResource(id: string) {
    return post(`/admin/resources/${encodeURIComponent(id)}/approve`)
  },

  async rejectResource(id: string, reason?: string) {
    return post(`/admin/resources/${encodeURIComponent(id)}/reject`, { reason })
  },

  // ---- Reports ----
  async listReports(query: AdminQuery = {}) {
    return get<AdminPaginated<AdminReport>>('/admin/reports', { params: query })
  },

  async resolveReport(id: string) {
    return post(`/admin/reports/${encodeURIComponent(id)}/resolve`)
  },

  // ---- Audit logs ----
  async listAuditLogs(query: AdminQuery = {}) {
    return get<AdminPaginated<AdminAuditLog>>('/admin/audit-logs', { params: query })
  },

  async createAuditLog(payload: { action: string; context?: string }) {
    return post<AdminAuditLog>('/admin/audit-log', payload)
  }
}

