"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const express_1 = require("express");
const client_1 = require("../../prisma/client");
const api_1 = require("../../utils/api");
const audit_service_1 = require("./audit.service");
class AuditController {
    static async listLogs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            let pageSize = parseInt(req.query.pageSize) || 30;
            if (pageSize > 100)
                pageSize = 100;
            const [logs, total] = await Promise.all([
                client_1.prisma.auditLog.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: { createdAt: 'desc' }
                }),
                client_1.prisma.auditLog.count()
            ]);
            const items = logs.map(l => ({
                id: l.id,
                action: l.action,
                actor: l.actorId || 'System',
                context: l.metadata ? (typeof l.metadata === 'string' ? l.metadata : JSON.stringify(l.metadata)) : '',
                createdAt: l.createdAt
            }));
            res.json((0, api_1.buildPaginatedResponse)(items, page, pageSize, total));
        }
        catch (e) {
            next(e);
        }
    }
    static async createLog(req, res, next) {
        try {
            const { action, context } = req.body;
            const log = await audit_service_1.AuditService.log(req, req.user?.id || null, action, 'UI_ACTION', 'NONE', context);
            res.json(log);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.AuditController = AuditController;
//# sourceMappingURL=audit.controller.js.map