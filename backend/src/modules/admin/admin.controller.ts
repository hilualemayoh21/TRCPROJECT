import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { mapPaginatedResponse } from '../../utils/response-mappers';
import { NotFoundError, AppError } from '../../utils/api';
import { AuditService } from '../audit/audit.service';

export class AdminController {
  /** GET /admin/analytics/overview — Real dashboard stats */
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalUsers, totalResources, pendingApprovals, pendingResearchers, openReports, recentLogs] = await Promise.all([
        prisma.user.count({ where: { deletedAt: null } }),
        prisma.resource.count({ where: { deletedAt: null, status: 'approved' } }),
        prisma.resource.count({ where: { deletedAt: null, status: 'pending' } }),
        prisma.user.count({ where: { status: 'pending', deletedAt: null } }),
        prisma.report.count({ where: { status: 'open' } }),
        prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
      ]);

      res.json({
        totalUsers,
        totalResources,
        pendingApprovals,
        pendingResearchers,
        openReports,
        recentActivity: recentLogs.map((l: any) => ({
          id: l.id,
          action: l.action,
          actor: l.actorId || 'System',
          entityType: l.entityType,
          entityId: l.entityId,
          createdAt: l.createdAt.getTime(),
          context: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
        })),
      });
    } catch (e) { next(e); }
  }

  /** GET /admin/researchers/requests — Pending researcher accounts */
  static async listResearcherRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;
      if (pageSize > 100) pageSize = 100;

      const where = { status: 'pending', deletedAt: null };
      const [items, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: { id: true, name: true, email: true, institution: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.user.count({ where }),
      ]);

      res.json(mapPaginatedResponse(items, { page, pageSize, total }));
    } catch (e) { next(e); }
  }

  /** POST /admin/researchers/:id/approve — Approve researcher */
  static async approveResearcher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await prisma.user.findFirst({ where: { id, status: 'pending' } });
      if (!user) throw new NotFoundError('Pending researcher not found');

      await prisma.user.update({ where: { id }, data: { status: 'active' } });
      AuditService.log(req, req.user!.id, 'researcher.approved', 'User', id).catch(() => {});

      res.json({ ok: true, message: 'Researcher approved' });
    } catch (e) { next(e); }
  }

  /** POST /admin/researchers/:id/reject — Reject researcher */
  static async rejectResearcher(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await prisma.user.findFirst({ where: { id, status: 'pending' } });
      if (!user) throw new NotFoundError('Pending researcher not found');

      await prisma.user.update({ where: { id }, data: { status: 'inactive' } });
      AuditService.log(req, req.user!.id, 'researcher.rejected', 'User', id).catch(() => {});

      res.json({ ok: true, message: 'Researcher rejected' });
    } catch (e) { next(e); }
  }

  /** GET /admin/resources/pending — Pending resources */
  static async listPendingResources(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;
      if (pageSize > 100) pageSize = 100;

      const where = { status: 'pending', deletedAt: null };
      const [items, total] = await Promise.all([
        prisma.resource.findMany({
          where,
          include: {
            author: { select: { id: true, name: true, email: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.resource.count({ where }),
      ]);

      res.json(mapPaginatedResponse(items, { page, pageSize, total }));
    } catch (e) { next(e); }
  }

  /** GET /admin/reports — Open reports */
  static async listReports(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 10;
      if (pageSize > 100) pageSize = 100;
      const statusFilter = String(req.query.status || 'open');

      const where = { status: statusFilter };
      const [items, total] = await Promise.all([
        prisma.report.findMany({
          where,
          include: { reporter: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.report.count({ where }),
      ]);

      res.json(mapPaginatedResponse(items, { page, pageSize, total }));
    } catch (e) { next(e); }
  }

  /** POST /admin/reports/:id/resolve — Resolve a report */
  static async resolveReport(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { action, note } = req.body as { action?: string; note?: string };
      const report = await prisma.report.findUnique({ where: { id } });
      if (!report) throw new NotFoundError('Report not found');
      if (report.status !== 'open') throw new AppError('Report already resolved', 400);

      const status = action === 'dismiss' ? 'dismissed' : 'resolved';
      const updated = await prisma.report.update({
        where: { id },
        data: { status, resolvedBy: req.user!.id, resolvedAt: new Date(), resolveNote: note || null },
      });

      AuditService.log(req, req.user!.id, `report.${status}`, 'Report', id, { entityType: report.entityType, entityId: report.entityId }).catch(() => {});

      res.json(updated);
    } catch (e) { next(e); }
  }
}
