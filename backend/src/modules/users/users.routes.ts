import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();
const adminRouter = Router();

// /admin/users routes
adminRouter.use(requireAuth, resolvePermissions, requirePermission('manage_users'));
adminRouter.get('/', UsersController.listUsers);
adminRouter.post('/', UsersController.createUser);
adminRouter.get('/:id', UsersController.getUser);
adminRouter.patch('/:id', UsersController.updateUser);
adminRouter.patch('/:id/status', UsersController.updateStatus);
adminRouter.delete('/:id', UsersController.deleteUser);

// /users/:id/roles route
router.post('/:id/roles', requireAuth, resolvePermissions, requirePermission('manage_users'), UsersController.assignRole);

export { router as usersRouter, adminRouter as adminUsersRouter };
