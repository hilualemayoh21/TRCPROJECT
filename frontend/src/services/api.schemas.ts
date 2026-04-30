import { z } from 'zod'

export const PermissionSchema = z.enum([
  'manage_users',
  'manage_roles',
  'approve_resources',
  'approve_researchers',
  'view_reports',
  'resolve_reports',
  'upload_resource',
  '*'
])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string(),
  permissions: z.array(PermissionSchema).catch([]),
  active: z.boolean().optional(),
  institution: z.string().optional()
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
  permissions: z.array(PermissionSchema).optional()
})

export const RefreshResponseSchema = z.object({
  token: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional()
})

export const RoleSchema = z.object({
  id: z.string(),
  key: z.string().optional(),
  name: z.string(),
  permissions: z.array(PermissionSchema),
  isSystem: z.boolean().optional()
})

export const RolePermissionToggleSchema = z.object({
  ok: z.boolean(),
  permissions: z.array(PermissionSchema)
})

export const AssignRoleResponseSchema = z.object({
  ok: z.boolean(),
  user: UserSchema
})

export const PaginatedUsersSchema = z.object({
  items: z.array(UserSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number()
})

export type Permission = z.infer<typeof PermissionSchema>
export type User = z.infer<typeof UserSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>
export type Role = z.infer<typeof RoleSchema>
