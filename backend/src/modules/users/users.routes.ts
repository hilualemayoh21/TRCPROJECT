import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';
import { avatarUpload } from '../../shared/utils/upload.util';

const router = Router();
const adminRouter = Router();

// All user management requires authentication
adminRouter.use(requireAuth, requireVerifiedEmail, resolvePermissions);

// Read
adminRouter.get('/', requirePermission('view_users'), UsersController.listUsers);
adminRouter.get('/:id', requirePermission('view_users'), UsersController.getUser);

// Create
adminRouter.post('/', requirePermission('create_users'), UsersController.createUser);

// Update/Delete
adminRouter.patch('/:id', requirePermission('update_users'), UsersController.updateUser);
adminRouter.patch('/:id/status', requirePermission('update_users'), UsersController.updateStatus);
adminRouter.delete('/:id', requirePermission('delete_users'), UsersController.deleteUser);
adminRouter.post('/:id/roles', requirePermission('update_users'), UsersController.assignRole);

// /users/me routes
router.get('/me', requireAuth, requireVerifiedEmail, UsersController.getMe);
router.patch('/me', requireAuth, requireVerifiedEmail, UsersController.updateMe);
router.patch('/me/avatar', requireAuth, requireVerifiedEmail, avatarUpload.single('avatar'), UsersController.updateAvatar);

export { router as usersRouter, adminRouter as adminUsersRouter };
