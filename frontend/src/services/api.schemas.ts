import { z } from 'zod'

// Handle both simple string keys and full permission objects from backend
export const PermissionSchema = z.union([
  z.string(),
  z.object({ key: z.string() }).transform(o => o.key),
  z.object({ permission: z.object({ key: z.string() }) }).transform(o => o.permission.key)
])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  role: z.string(),
  permissions: z.array(PermissionSchema).catch([]).nullable().optional().default([]),
  active: z.boolean().optional(),
  institution: z.string().optional().nullable()
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
  permissions: z.array(z.string()).optional()
})

export const RefreshResponseSchema = z.object({
  token: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional()
})

export const RoleSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  key: z.string().optional().nullable(),
  name: z.string().optional().default('Unnamed Role'),
  permissions: z.array(PermissionSchema).catch([]).nullable().optional().default([]),
  isSystem: z.boolean().optional().default(false)
}).passthrough()

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
