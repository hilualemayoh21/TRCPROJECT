import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { mapPaginatedResponse } from '../../utils/response-mappers';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalUsers, recentLogs] = await Promise.all([
        prisma.user.count(),
        prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
      ]);

      res.json({
        totalUsers,
        totalResources: 0,
        pendingApprovals: 0,
        recentActivity: recentLogs.map((l: any) => ({
          id: l.id,
          action: l.action,
          actor: l.actorId || 'System',
          createdAt: l.createdAt.getTime(),
          context: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : ''
        }))
      });
    } catch (e) {
      next(e);
    }
  }

  static async listResearcherRequests(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    let pageSize = parseInt(req.query.pageSize as string) || 10;
    if (pageSize > 100) pageSize = 100;
    res.json(mapPaginatedResponse([], { page, pageSize, total: 0 }));
  }

  static async listPendingResources(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    let pageSize = parseInt(req.query.pageSize as string) || 10;
    if (pageSize > 100) pageSize = 100;
    res.json(mapPaginatedResponse([], { page, pageSize, total: 0 }));
  }

  static async listReports(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    let pageSize = parseInt(req.query.pageSize as string) || 10;
    if (pageSize > 100) pageSize = 100;
    res.json(mapPaginatedResponse([], { page, pageSize, total: 0 }));
  }

  static async resolveReport(req: Request, res: Response) {
    res.json({ ok: true });
  }
}
