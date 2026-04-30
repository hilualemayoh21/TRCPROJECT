import Redis from 'ioredis';
import { Queue } from 'bullmq';
import logger from './logger';
import { config } from '../config';

const REDIS_URL = config.redisUrl;

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => logger.error({ err }, 'Redis connection error'));
redis.on('connect', () => logger.info('Connected to Redis'));

// Background Job Queues
export const auditQueue = new Queue('audit-logs', { connection: redis });
export const emailQueue = new Queue('emails', { connection: redis });

export async function cacheGet(key: string) {
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
}

export async function cacheSet(key: string, value: any, ttl = 3600) {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

export async function cacheDel(key: string) {
  await redis.del(key);
}
