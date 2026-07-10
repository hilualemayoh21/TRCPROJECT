import { Router } from 'express';
import { RolesController } from './roles.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// Apply auth and permission resolve to all role routes
router.use(requireAuth, requireVerifiedEmail, resolvePermissions);

// Read roles
router.get('/roles', requirePermission('view_roles'), RolesController.getRoles);

// Modify roles
router.post('/roles', requirePermission('create_roles'), RolesController.createRole);
router.patch('/roles/:id', requirePermission('update_roles'), RolesController.updateRole);
router.delete('/roles/:id', requirePermission('delete_roles'), RolesController.deleteRole);

router.post('/roles/:id/permissions', requirePermission('update_roles'), RolesController.togglePermission);
router.delete('/roles/:id/permissions', requirePermission('update_roles'), RolesController.togglePermission);

export default router;
