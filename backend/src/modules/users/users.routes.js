"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUsersRouter = exports.usersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rbac_middleware_1 = require("../../middleware/rbac.middleware");
const router = (0, express_1.Router)();
exports.usersRouter = router;
const adminRouter = (0, express_1.Router)();
exports.adminUsersRouter = adminRouter;
// /admin/users routes
adminRouter.use(auth_middleware_1.requireAuth, rbac_middleware_1.resolvePermissions, (0, rbac_middleware_1.requirePermission)('manage_users'));
adminRouter.get('/', users_controller_1.UsersController.listUsers);
adminRouter.patch('/:id/status', users_controller_1.UsersController.updateStatus);
// /users/:id/roles route
router.post('/:id/roles', auth_middleware_1.requireAuth, rbac_middleware_1.resolvePermissions, (0, rbac_middleware_1.requirePermission)('manage_users'), users_controller_1.UsersController.assignRole);
//# sourceMappingURL=users.routes.js.map