import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { AuditService } from '../audit/audit.service';
import { AppError } from '../../utils/api';

export class RolesController {
  static async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await prisma.role.findMany({
        where: { deletedAt: null },
        include: { permissions: { include: { permission: true } } }
      });

      const formatted = roles.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        permissions: r.permissions.map((rp: any) => rp.permission.key)
      }));

      res.json(formatted);
    } catch (e) {
      next(e);
    }
  }

  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, permissions } = req.body;
      const existing = await prisma.role.findUnique({ where: { name } });
      if (existing) throw new AppError('Role name must be unique', 400);

      const role = await prisma.role.create({
        data: { name, description }
      });

      if (permissions && Array.isArray(permissions)) {
        for (const p of permissions) {
          let perm = await prisma.permission.findUnique({ where: { key: p } });
          if (!perm) perm = await prisma.permission.create({ data: { key: p } });
          await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perm.id } });
        }
      }

      await AuditService.log(req, req.user?.id || null, 'Role created', 'Role', role.id, { name });

      res.json({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        permissions: permissions || []
      });
    } catch (e) {
      next(e);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const { name, description, permissions } = req.body;

      const role = await prisma.role.findUnique({ where: { id } });
      if (!role) throw new AppError('Role not found', 404);
      if (role.isSystem) throw new AppError('Cannot modify system roles directly', 403);

      const updated = await prisma.role.update({
        where: { id },
        data: { name, description }
      });

      if (permissions && Array.isArray(permissions)) {
        await prisma.rolePermission.deleteMany({ where: { roleId: id } });
        for (const p of permissions) {
          let perm = await prisma.permission.findUnique({ where: { key: p } });
          if (!perm) perm = await prisma.permission.create({ data: { key: p } });
          await prisma.rolePermission.create({ data: { roleId: id, permissionId: perm.id } });
        }

        // Increment permissionVersion for all users with this role
        await prisma.user.updateMany({
          where: { roles: { some: { roleId: id } } },
          data: { permissionVersion: { increment: 1 } }
        });
      }

      const freshRole = await prisma.role.findUnique({
        where: { id: id as string },
        include: { permissions: { include: { permission: true } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'Role updated', 'Role', id as string, { name });

      res.json({
        id: freshRole!.id,
        name: freshRole!.name,
        description: freshRole!.description,
        isSystem: freshRole!.isSystem,
        permissions: freshRole!.permissions.map(rp => rp.permission.key)
      });
    } catch (e) {
      next(e);
    }
  }

  static async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const role = await prisma.role.findUnique({ where: { id } });
      if (!role) throw new AppError('Role not found', 404);
      if (role.isSystem) throw new AppError('Cannot delete system roles', 403);

      await prisma.role.delete({ where: { id: id as string } });
      await AuditService.log(req, (req.user?.id as string) || null, 'Role deleted', 'Role', id as string);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }

  static async togglePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as any;
      const { permission } = req.body;
      const isAdd = req.method === 'POST';

      const role = await prisma.role.findUnique({ where: { id: id as string } });
      if (!role) throw new AppError('Role not found', 404);

      let perm = await prisma.permission.findUnique({ where: { key: permission as string } });
      if (!perm && isAdd) {
        perm = await prisma.permission.create({ data: { key: permission } });
      }

      if (perm) {
        if (isAdd) {
          await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: id as string, permissionId: perm.id } },
            update: {},
            create: { roleId: id as string, permissionId: perm.id }
          });
        } else {
          await prisma.rolePermission.deleteMany({
            where: { roleId: id as string, permissionId: perm.id }
          });
        }

        // Increment permissionVersion for all users with this role
        await prisma.user.updateMany({
          where: { roles: { some: { roleId: id as string } } },
          data: { permissionVersion: { increment: 1 } }
        });
      }

      const updated = await prisma.role.findUnique({
        where: { id: id as string },
        include: { permissions: { include: { permission: true } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, isAdd ? 'Role permission added' : 'Role permission removed', 'Role', id as string, { permission });

      res.json({ ok: true, permissions: (updated as any)!.permissions.map((rp: any) => rp.permission.key) });
    } catch (e) {
      next(e);
    }
  }
}
