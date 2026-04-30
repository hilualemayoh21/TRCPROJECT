import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';
import { AppError, PermissionError } from '../utils/api';
import { cacheGet, cacheSet } from '../utils/redis';
import { AuditService } from '../modules/audit/audit.service';

export const resolvePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);

    const cacheKey = `perms:${req.user.id}:${req.user.permissionVersion}`;
    const cachedPerms = await cacheGet(cacheKey);

    if (cachedPerms) {
      req.permissions = new Set(cachedPerms);
      return next();
    }

    const userRoles = await prisma.userRole.findMany({
      where: { userId: req.user.id },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } }
        }
      }
    });

    const permissions = new Set<string>();

    for (const ur of userRoles) {
      if (ur.role.id === 'super_admin' || ur.role.name === 'Super Admin') {
        permissions.add('*');
      }
      ur.role.permissions.forEach((rp: any) => permissions.add(rp.permission.key));
    }

    // Cache permissions for 10 minutes
    await cacheSet(cacheKey, Array.from(permissions), 600);

    req.permissions = permissions;
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.permissions) {
      return next(new PermissionError());
    }
    if (req.permissions.has('*') || req.permissions.has(requiredPermission)) {
      return next();
    }

    // Log the denial
    AuditService.log(
      req,
      req.user?.id || null,
      'Permission denied',
      'Security',
      'NONE',
      { requiredPermission, hasPermissions: Array.from(req.permissions) }
    ).catch(() => {});

    return next(new PermissionError(`Insufficient permissions: ${requiredPermission}`));
  };
};
