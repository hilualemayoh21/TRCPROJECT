import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { buildPaginatedResponse, AppError } from '../../utils/api';
import { AuditService } from '../audit/audit.service';
import { withTimeout } from '../../utils/resilience';

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
            include: { roles: { include: { role: true } } },
            orderBy: { createdAt: 'desc' }
          }),
          prisma.user.count({ where })
        ]),
        5000,
        'User listing query timed out'
      );

      const items = users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        active: u.status === 'active',
        role: u.roles[0]?.role?.name || 'public_user'
      }));

      res.json(buildPaginatedResponse(items, page, pageSize, total));
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
        include: { roles: { include: { role: true } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, active ? 'User activated' : 'User deactivated', 'User', id as string);

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.status === 'active',
        role: user.roles[0]?.role?.name || 'public_user'
      });
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

      const permissions = (updatedUser as any).roles[0]?.role?.permissions.map((rp: any) => rp.permission.key) || [];
      if ((updatedUser as any).roles[0]?.role?.id === 'super_admin') permissions.push('*');

      await AuditService.log(req, (req.user?.id as string) || null, 'User role changed', 'User', id as string, { newRole: role });

      res.json({
        ok: true,
        user: {
          id: updatedUser!.id,
          name: updatedUser!.name,
          email: updatedUser!.email,
          active: updatedUser!.status === 'active',
          role: (updatedUser as any).roles[0]?.role?.name,
          permissions
        }
      });
    } catch (e) {
      next(e);
    }
  }
}
