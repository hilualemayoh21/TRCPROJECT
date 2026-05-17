import { z } from 'zod'

export type RoleKey = 'super_admin' | 'admin' | 'moderator' | 'researcher' | 'public_user'

export type Permission =
  | 'view_users' | 'create_users' | 'update_users' | 'delete_users'
  | 'view_roles' | 'create_roles' | 'update_roles' | 'delete_roles'
  | 'view_resources' | 'create_resources' | 'update_resources' | 'delete_resources' | 'approve_resources'
  | 'view_reports' | 'resolve_reports'
  | 'view_researchers' | 'approve_researchers'
  | 'view_audit_logs'
  | 'view_dashboard'

export type AdminQuery = {
  page?: number
  pageSize?: number
  q?: string
  status?: string
}

export type AdminPaginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: RoleKey
  active: boolean
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}

export type AdminRole = {
  id: string
  name: string
  description?: string
  permissions: Permission[]
  isSystem?: boolean
}

export const AdminRoleSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().nullable().optional().default('Unnamed Role').catch('Unnamed Role'),
  description: z.string().nullable().optional().default(null).catch(null),
  permissions: z.array(z.any()).catch([]).nullable().optional().default([]),
  isSystem: z.boolean().nullable().optional().default(false).catch(false)
}).passthrough()

export type ResearcherApprovalRequest = {
  id: string
  userId: string
  name: string
  email: string
  institution?: string
  createdAt?: string
}

export type ResourceApprovalItem = {
  id: string
  title: string
  submittedBy: string
  submittedAt?: string
  type?: string
}

export type AdminReport = {
  id: string
  resourceId?: string
  reporter: string
  reason: string
  status: 'open' | 'resolved'
  createdAt?: string
}

export type AdminAuditLog = {
  id: string
  action: string
  actor?: string
  context?: string
  createdAt?: string
}
