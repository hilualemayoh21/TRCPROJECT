/**
 * Response Mappers
 * 
 * Ensures all API responses match the frontend's Zod-validated contract.
 */

export interface PrismaUser {
  id: string;
  name: string;
  email: string;
  status?: string;
  institution?: string;
  permissionVersion?: number;
  roles?: {
    role: {
      id: string;
      name: string;
      permissions: {
        permission: {
          key: string;
        };
      }[];
    };
  }[];
}

export function mapUser(user: PrismaUser) {
  const permissions = new Set<string>();
  let primaryRole = 'public_user';

  if (user.roles && user.roles.length > 0) {
    primaryRole = user.roles[0].role.name;
    for (const userRole of user.roles) {
      if (userRole.role.name === 'super_admin') {
        permissions.add('*');
      }
      if (userRole.role.permissions) {
        userRole.role.permissions.forEach(rp => {
          permissions.add(rp.permission.key);
        });
      }
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: primaryRole,
    permissions: Array.from(permissions),
    active: user.status === 'active',
    institution: user.institution || undefined,
  };
}

export function mapAuthResponse(user: PrismaUser, tokens: { accessToken: string; refreshToken?: string; expiresAt: number }) {
  return {
    user: mapUser(user),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
  };
}

export function mapRefreshResponse(tokens: { accessToken: string; refreshToken?: string; expiresAt: number }) {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
  };
}

export function mapRole(role: any) {
  return {
    id: role.id,
    name: role.name,
    permissions: role.permissions ? role.permissions.map((rp: any) => rp.permission.key) : [],
    isSystem: !!role.isSystem,
  };
}

export function mapPaginatedResponse<T>(items: T[], metadata: { page: number; pageSize: number; total: number }) {
  return {
    items,
    page: metadata.page,
    pageSize: metadata.pageSize,
    total: metadata.total,
  };
}
