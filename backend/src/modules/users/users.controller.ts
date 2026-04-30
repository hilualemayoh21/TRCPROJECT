import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { AppError } from '../../utils/api';
import { AuditService } from '../audit/audit.service';
import { withTimeout } from '../../utils/resilience';
import { mapUser, mapPaginatedResponse } from '../../utils/response-mappers';

export class UsersController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;
      if (pageSize > 100) pageSize = 100;
      const q = (req.query.q as string) || '';

      const where = {
        deletedAt: null,
        ...(q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } }
          ]
        } : {})
      };

      const [users, total] = await withTimeout(
        Promise.all([
          prisma.user.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
            orderBy: { createdAt: 'desc' }
          }),
          prisma.user.count({ where })
        ]),
        5000,
        'User listing query timed out'
      );

      const items = users.map((u: any) => mapUser(u));

      res.json(mapPaginatedResponse(items, { page, pageSize, total }));
    } catch (e) {
      next(e);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { active } = req.body;

      const user = await prisma.user.update({
        where: { id: id as string },
        data: { status: active ? 'active' : 'inactive' },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, active ? 'User activated' : 'User deactivated', 'User', id as string);

      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async assignRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const dbRole = await prisma.role.findUnique({ where: { name: role as string } });
      if (!dbRole) throw new AppError('Role not found', 404);

      // Prevent removing last admin
      if (dbRole.id !== 'super_admin') {
        const adminRole = await prisma.role.findUnique({ where: { name: 'super_admin' } });
        if (adminRole) {
          const userRoles = await prisma.userRole.findFirst({ where: { userId: id as string, roleId: adminRole.id } });
          if (userRoles) {
            const adminCount = await prisma.userRole.count({ where: { roleId: adminRole.id } });
            if (adminCount <= 1) {
              throw new AppError('Cannot remove the last super_admin', 400);
            }
          }
        }
      }

      await prisma.userRole.deleteMany({ where: { userId: id as string } });
      await prisma.userRole.create({ data: { userId: id as string, roleId: dbRole.id } });

      const updatedUser = await prisma.user.update({
        where: { id: id as string },
        data: { permissionVersion: { increment: 1 } },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'User role changed', 'User', id as string, { newRole: role });

      res.json({
        ok: true,
        user: mapUser(updatedUser as any)
      });
    } catch (e) {
      next(e);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: id as string, deletedAt: null },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });
      if (!user) throw new AppError('User not found', 404);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, role, institution } = req.body;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new AppError('Email already in use', 400);

      const passwordHash = await require('bcrypt').hash(password || 'Temporary123!', 10);
      const dbRole = await prisma.role.findUnique({ where: { name: role as string } });

      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          institution,
          roles: dbRole ? { create: { roleId: dbRole.id } } : undefined
        },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'User created by admin', 'User', user.id);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, password, active, institution } = req.body;

      const data: any = { name, email, institution };
      if (password) data.passwordHash = await require('bcrypt').hash(password, 10);
      if (active !== undefined) data.status = active ? 'active' : 'inactive';

      const user = await prisma.user.update({
        where: { id: id as string },
        data,
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'User updated by admin', 'User', id as string);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.user.update({
        where: { id: id as string },
        data: { deletedAt: new Date() }
      });
      await AuditService.log(req, (req.user?.id as string) || null, 'User deleted by admin', 'User', id as string);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
}
