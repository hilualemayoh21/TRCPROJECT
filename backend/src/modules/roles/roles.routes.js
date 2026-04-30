"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_controller_1 = require("./roles.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// Apply auth and permission checks to all role routes
router.use(auth_middleware_1.requireAuth, rbac_middleware_1.resolvePermissions, (0, rbac_middleware_1.requirePermission)('manage_roles'));
router.get('/', roles_controller_1.RolesController.getRoles);
router.post('/', roles_controller_1.RolesController.createRole);
router.patch('/:id', roles_controller_1.RolesController.updateRole);
router.delete('/:id', roles_controller_1.RolesController.deleteRole);
router.post('/:id/permissions', roles_controller_1.RolesController.togglePermission);
router.delete('/:id/permissions', roles_controller_1.RolesController.togglePermission);
exports.default = router;
//# sourceMappingURL=roles.routes.js.map