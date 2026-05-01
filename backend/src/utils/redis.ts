import Redis from 'ioredis';
import logger from './logger';
import { config } from '../config';

const REDIS_URL = config.redisUrl;
const isDev = config.nodeEnv === 'development';

// ── Graceful Redis: in dev, a failed connection doesn't crash the server ──

let redisInstance: Redis | null = null;

function createRedis(): Redis | null {
  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableOfflineQueue: false,
      lazyConnect: true,
    });

    client.on('error', (err) => {
      if (isDev) {
        // Only log once to avoid spam
        logger.warn({ code: err.code }, 'Redis unavailable in dev – running without cache/queues');
      } else {
        logger.error({ err }, 'Redis connection error');
      }
    });

    client.on('connect', () => logger.info('Connected to Redis'));

    // Don't await – just attempt connection
    client.connect().catch(() => {});

    return client;
  } catch (err) {
    logger.warn('Could not initialise Redis client');
    return null;
  }
}

export const redis = createRedis()!;

// ── Null-safe BullMQ queues ──
// We only create queues when Redis is actually available
let _auditQueue: import('bullmq').Queue | null = null;
let _emailQueue: import('bullmq').Queue | null = null;

async function getQueues() {
  if (!redis) return;
  try {
    const { Queue } = await import('bullmq');
    _auditQueue = new Queue('audit-logs', { connection: redis });
    _emailQueue = new Queue('emails', { connection: redis });
  } catch {
    // bullmq failed (no Redis), queues stay null
  }
}

getQueues();

export const auditQueue = {
  add: async (name: string, data: any) => {
    if (_auditQueue) return _auditQueue.add(name, data);
  }
};

export const emailQueue = {
  add: async (name: string, data: any) => {
    if (_emailQueue) return _emailQueue.add(name, data);
  }
};

// ── Cache helpers (no-ops when Redis is down) ──
export async function cacheGet(key: string): Promise<any> {
  if (!redis) return null;
  try {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttl = 3600): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {}
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {}
}
