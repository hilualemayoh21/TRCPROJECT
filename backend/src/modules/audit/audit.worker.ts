import { Worker, Job } from 'bullmq';
import { redis } from '../../utils/redis';
import { prisma } from '../../prisma/client';
import logger from '../../utils/logger';
import { withRetry } from '../../utils/resilience';

export const auditWorker = new Worker(
  'audit-logs',
  async (job: Job) => {
    const { actorId, action, entityType, entityId, metadata, ipAddress, userAgent } = job.data;
    
    try {
      await withRetry(async () => {
        await prisma.auditLog.create({
          data: {
            actorId,
            action,
            entityType,
            entityId,
            ipAddress,
            userAgent,
            metadata: metadata || null,
          }
        });
      }, 3, 500); // 3 retries, starting at 500ms
    } catch (error) {
      logger.error({ error, jobId: job.id }, 'Audit worker failed to process job after retries');
      throw error; // Let BullMQ handle retries for permanent failures
    }
  },
  { connection: redis }
);

auditWorker.on('completed', (job) => {
  logger.debug({ jobId: job.id }, 'Audit log job completed');
});

auditWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Audit log job failed');
});
