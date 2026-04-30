"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("./audit.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, rbac_middleware_1.resolvePermissions);
router.get('/audit-logs', (0, rbac_middleware_1.requirePermission)('view_audit_logs'), audit_controller_1.AuditController.listLogs);
router.post('/audit-log', audit_controller_1.AuditController.createLog);
exports.default = router;
//# sourceMappingURL=audit.routes.js.map