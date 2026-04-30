"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const express_1 = require("express");
const redis_1 = require("../../utils/redis");
const logger_1 = __importDefault(require("../../utils/logger"));
class AuditService {
    static async log(req, actorId, action, entityType, entityId, metadata) {
        try {
            const ipAddress = req?.ip || null;
            const userAgent = req?.headers['user-agent'] || null;
            await redis_1.auditQueue.add('log-action', {
                actorId,
                action,
                entityType,
                entityId,
                ipAddress,
                userAgent,
                metadata,
                timestamp: new Date()
            });
        }
        catch (error) {
            logger_1.default.error({ error }, 'Failed to queue audit log');
        }
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map