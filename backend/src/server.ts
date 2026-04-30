import { config } from './config';
import app from './app';
import './modules/audit/audit.worker'; // Register worker
import { prisma } from './prisma/client';
import { redis, auditQueue } from './utils/redis';
import logger from './utils/logger';

const server = app.listen(config.port, () => {
  logger.info(`🚀 TRC Backend (${config.env}) running on http://localhost:${config.port}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    
    try {
      await auditQueue.close();
      logger.info('Audit queue closed.');
      
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
