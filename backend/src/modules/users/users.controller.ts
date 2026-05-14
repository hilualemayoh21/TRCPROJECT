import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { AppError } from '../../utils/api';
import { AuditService } from '../audit/audit.service';
import { mapUser, mapPaginatedResponse } from '../../utils/response-mappers';

export class UsersController {
  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const q = req.query.q as string;

      const where: any = { deletedAt: null };
      if (q) {
        where.OR = [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } }
        ];
      }

      const [total, items] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
          where,
          include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' }
        })
      ]);

      res.json(mapPaginatedResponse(items.map(u => mapUser(u as any)), { total, page, pageSize }));
    } catch (e) {
      next(e);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await prisma.user.findUnique({
        where: { id, deletedAt: null },
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
      
      // 1. Look for ANY user with this email (including legacy deleted ones)
      const conflict = await prisma.user.findFirst({ 
        where: { email: { equals: email, mode: 'insensitive' } } 
      });

      if (conflict) {
        if (!conflict.deletedAt) {
          throw new AppError('Email already in use by an active account', 400);
        }
        
        // Legacy cleanup: rename the deleted user to free up the email string
        await prisma.user.update({
          where: { id: conflict.id },
          data: { email: `${conflict.id}_cleanup_${Date.now()}_${conflict.email}`.slice(0, 254) }
        });
      }

      const passwordHash = await require('bcrypt').hash(password || 'Temporary123!', 10);
      const dbRole = await prisma.role.findFirst({ 
        where: { 
          OR: [
            { name: role as string },
            { id: role as string }
          ]
        } 
      });

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
      res.status(201).json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { name, email, password, active, institution } = req.body;

      if (email) {
        const existing = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: 'insensitive' },
            deletedAt: null,
            NOT: { id }
          }
        });
        if (existing) throw new AppError('New email is already in use', 400);
      }

      const data: any = { name, email, institution };
      if (password) data.passwordHash = await require('bcrypt').hash(password, 10);
      if (active !== undefined) data.status = active ? 'active' : 'inactive';

      const user = await prisma.user.update({
        where: { id },
        data,
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'User updated by admin', 'User', id);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new AppError('User not found', 404);

      const deletedEmail = `${id}_deleted_${user.email}`;

      await prisma.user.update({
        where: { id },
        data: { 
          deletedAt: new Date(),
          email: deletedEmail.slice(0, 254),
          status: 'inactive'
        }
      });

      await AuditService.log(req, (req.user?.id as string) || null, 'User deleted by admin', 'User', id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { active } = req.body;
      const user = await prisma.user.update({
        where: { id },
        data: { status: active ? 'active' : 'inactive' }
      });
      res.json({ ok: true, active: user.status === 'active' });
    } catch (e) {
      next(e);
    }
  }

  static async assignRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { role } = req.body;
      const dbRole = await prisma.role.findFirst({
        where: { OR: [{ id: role }, { name: role }] }
      });
      if (!dbRole) throw new AppError('Role not found', 404);

      await prisma.userRole.deleteMany({ where: { userId: id } });
      await prisma.userRole.create({ data: { userId: id, roleId: dbRole.id } });

      const user = await prisma.user.findUnique({
        where: { id },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });
      res.json({ ok: true, user: mapUser(user as any) });
    } catch (e) {
      next(e);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id;
      if (!id) throw new AppError('Unauthorized', 401);

      const user = await prisma.user.findUnique({
        where: { id, deletedAt: null },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });
      if (!user) throw new AppError('User not found', 404);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user?.id;
      if (!id) throw new AppError('Unauthorized', 401);

      const { name, email, institution } = req.body;
      
      if (email) {
        const existing = await prisma.user.findFirst({
          where: {
            email: { equals: email, mode: 'insensitive' },
            deletedAt: null,
            NOT: { id }
          }
        });
        if (existing) throw new AppError('Email already in use', 400);
      }

      const data: any = { name, email, institution };

      const user = await prisma.user.update({
        where: { id },
        data,
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });

      await AuditService.log(req, id, 'Profile updated by user', 'User', id);
      res.json(mapUser(user as any));
    } catch (e) {
      next(e);
    }
  }

  static async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(req as any).file) throw new AppError('No file uploaded', 400);

      const userId = (req as any).user.id;
      const avatarUrl = `/uploads/avatars/${(req as any).file.filename}`;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl }
      });

      await AuditService.log(req, userId, 'Avatar updated', 'User', userId);
      res.json({ message: 'Avatar updated', avatarUrl });
    } catch (e) {
      next(e);
    }
  }
}
