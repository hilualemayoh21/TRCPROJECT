import Redis from 'ioredis';
import { Queue } from 'bullmq';
export declare const redis: Redis;
export declare const auditQueue: Queue<any, any, string, any, any, string>;
export declare const emailQueue: Queue<any, any, string, any, any, string>;
export declare function cacheGet(key: string): Promise<any>;
export declare function cacheSet(key: string, value: any, ttl?: number): Promise<void>;
export declare function cacheDel(key: string): Promise<void>;
//# sourceMappingURL=redis.d.ts.map