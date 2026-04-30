"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../utils/redis");
const client_1 = require("../../prisma/client");
const logger_1 = __importDefault(require("../../utils/logger"));
const resilience_1 = require("../../utils/resilience");
exports.auditWorker = new bullmq_1.Worker('audit-logs', async (job) => {
    const { actorId, action, entityType, entityId, metadata, ipAddress, userAgent } = job.data;
    try {
        await (0, resilience_1.withRetry)(async () => {
            await client_1.prisma.auditLog.create({
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
    }
    catch (error) {
        logger_1.default.error({ error, jobId: job.id }, 'Audit worker failed to process job after retries');
        throw error; // Let BullMQ handle retries for permanent failures
    }
}, { connection: redis_1.redis });
exports.auditWorker.on('completed', (job) => {
    logger_1.default.debug({ jobId: job.id }, 'Audit log job completed');
});
exports.auditWorker.on('failed', (job, err) => {
    logger_1.default.error({ jobId: job?.id, err }, 'Audit log job failed');
});
//# sourceMappingURL=audit.worker.js.map