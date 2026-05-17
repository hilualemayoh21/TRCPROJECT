export const permissionsMap: Record<string, string[]> = {
  super_admin: ['*'],
  admin: [
    'view_users', 'create_users', 'update_users', 'delete_users',
    'view_roles', 'create_roles', 'update_roles', 'delete_roles',
    'view_resources', 'create_resources', 'update_resources', 'delete_resources', 'approve_resources',
    'view_reports', 'resolve_reports',
    'view_researchers', 'approve_researchers',
    'view_audit_logs', 'view_dashboard'
  ],
  moderator: ['view_reports', 'resolve_reports', 'view_resources', 'update_resources', 'approve_resources', 'view_dashboard'],
  researcher: ['view_dashboard', 'create_resources', 'update_resources'],
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
