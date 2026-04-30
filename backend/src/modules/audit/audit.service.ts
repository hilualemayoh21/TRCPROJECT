import { Request } from 'express';
import { auditQueue } from '../../utils/redis';
import logger from '../../utils/logger';

export class AuditService {
  static async log(
    req: Request | null,
    actorId: string | null,
    action: string,
    entityType: string,
    entityId: string,
    metadata?: any
  ) {
    try {
      const ipAddress = req?.ip || null;
      const userAgent = req?.headers['user-agent'] || null;

      await auditQueue.add('log-action', {
        actorId,
        action,
        entityType,
        entityId,
        ipAddress,
        userAgent,
        metadata,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error({ error }, 'Failed to queue audit log');
    }
  }
}
