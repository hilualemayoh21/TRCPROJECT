import { config } from './config';
import app from './app';
import './modules/audit/audit.worker'; // Register worker
import { prisma } from './prisma/client';
import { redis, auditQueue, emailQueue } from './utils/redis';
import logger from './utils/logger';
import { getEmailProviderStatus } from './utils/email';

const server = app.listen(config.port, () => {
  logger.info(`🚀 TRC Backend (${config.env}) running on http://localhost:${config.port}`);

  const emailStatus = getEmailProviderStatus();
  if (emailStatus.configured) {
    logger.info(
      `✉️  Email delivery enabled via ${emailStatus.provider} (from: ${emailStatus.from})`
    );
    if (emailStatus.sandboxHint) {
      logger.warn(`⚠️  ${emailStatus.sandboxHint}`);
    }
  } else {
    logger.warn('⚠️  No email provider configured — OTP codes will only appear in server logs');
  }
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await auditQueue.close();
      await emailQueue.close();
      logger.info('Queues closed.');
      
      await redis.quit();
      logger.info('Redis connection closed.');
      
      await prisma.$disconnect();
      logger.info('Prisma disconnected.');
      
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
