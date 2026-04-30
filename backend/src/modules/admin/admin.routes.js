"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, rbac_middleware_1.resolvePermissions);
router.get('/dashboard', (0, rbac_middleware_1.requirePermission)('view_dashboard'), admin_controller_1.AdminController.getDashboard);
router.get('/researchers/requests', (0, rbac_middleware_1.requirePermission)('manage_users'), admin_controller_1.AdminController.listResearcherRequests);
router.get('/resources/pending', (0, rbac_middleware_1.requirePermission)('approve_resources'), admin_controller_1.AdminController.listPendingResources);
router.get('/reports', (0, rbac_middleware_1.requirePermission)('resolve_reports'), admin_controller_1.AdminController.listReports);
router.post('/reports/:id/resolve', (0, rbac_middleware_1.requirePermission)('resolve_reports'), admin_controller_1.AdminController.resolveReport);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map