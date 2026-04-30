"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailQueue = exports.auditQueue = exports.redis = void 0;
exports.cacheGet = cacheGet;
exports.cacheSet = cacheSet;
exports.cacheDel = cacheDel;
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
const logger_1 = __importDefault(require("./logger"));
const config_1 = require("../config");
const REDIS_URL = config_1.config.redisUrl;
exports.redis = new ioredis_1.default(REDIS_URL, {
    maxRetriesPerRequest: null,
});
exports.redis.on('error', (err) => logger_1.default.error({ err }, 'Redis connection error'));
exports.redis.on('connect', () => logger_1.default.info('Connected to Redis'));
// Background Job Queues
exports.auditQueue = new bullmq_1.Queue('audit-logs', { connection: exports.redis });
exports.emailQueue = new bullmq_1.Queue('emails', { connection: exports.redis });
async function cacheGet(key) {
    const val = await exports.redis.get(key);
    return val ? JSON.parse(val) : null;
}
async function cacheSet(key, value, ttl = 3600) {
    await exports.redis.set(key, JSON.stringify(value), 'EX', ttl);
}
async function cacheDel(key) {
    await exports.redis.del(key);
}
//# sourceMappingURL=redis.js.map