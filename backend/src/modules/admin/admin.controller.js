"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const express_1 = require("express");
const client_1 = require("../../prisma/client");
const api_1 = require("../../utils/api");
class AdminController {
    static async getDashboard(req, res, next) {
        try {
            const [totalUsers, recentLogs] = await Promise.all([
                client_1.prisma.user.count(),
                client_1.prisma.auditLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
            ]);
            res.json({
                totalUsers,
                totalResources: 0, // Placeholder
                pendingApprovals: 0, // Placeholder
                recentActivity: recentLogs.map(l => ({
                    id: l.id,
                    action: l.action,
                    timestamp: l.createdAt
                }))
            });
        }
        catch (e) {
            next(e);
        }
    }
    // Stubs for Approvals and Reports
    static async listResearcherRequests(req, res) {
        const page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        if (pageSize > 100)
            pageSize = 100;
        res.json((0, api_1.buildPaginatedResponse)([], page, pageSize, 0));
    }
    static async listPendingResources(req, res) {
        const page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        if (pageSize > 100)
            pageSize = 100;
        res.json((0, api_1.buildPaginatedResponse)([], page, pageSize, 0));
    }
    static async listReports(req, res) {
        const page = parseInt(req.query.page) || 1;
        let pageSize = parseInt(req.query.pageSize) || 10;
        if (pageSize > 100)
            pageSize = 100;
        res.json((0, api_1.buildPaginatedResponse)([], page, pageSize, 0));
    }
    static async resolveReport(req, res) {
        res.json({ ok: true });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map