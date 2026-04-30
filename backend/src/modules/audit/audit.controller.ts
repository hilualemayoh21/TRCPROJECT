import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/client';
import { AuditService } from './audit.service';
import { mapPaginatedResponse } from '../../utils/response-mappers';

export class AuditController {
  static async listLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      let pageSize = parseInt(req.query.pageSize as string) || 30;
      if (pageSize > 100) pageSize = 100;

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.auditLog.count()
      ]);

      const items = logs.map((l: any) => ({
        id: l.id,
        action: l.action,
        actor: l.actorId || 'System',
        context: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
        createdAt: l.createdAt.getTime()
      }));

      res.json(mapPaginatedResponse(items, { page, pageSize, total }));
    } catch (e) {
      next(e);
    }
  }

  static async createLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { action, context } = req.body;
      const log = await AuditService.log(
        req,
        req.user?.id || null,
        action,
        'UI_ACTION',
        'NONE',
        context
      );
      res.json(log);
    } catch (e) {
      next(e);
    }
  }
}
