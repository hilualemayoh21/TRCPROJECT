export const permissionsMap: Record<string, string[]> = {
  super_admin: ['*'],
  admin: ['manage_users', 'manage_roles', 'approve_resources'],
  moderator: ['approve_resources'],
  researcher: ['upload_resource'],
  public_user: []
}

export function can(role: string, permission: string): boolean {
  const permissions = permissionsMap[role] || []
  if (permissions.includes('*')) return true
  return permissions.includes(permission)
}

// Backwards compatibility for existing imports
export const ROLE_PERMISSIONS = permissionsMap
export const hasPermission = can
