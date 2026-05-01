import { Router } from 'express';
import { RolesController } from './roles.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// Apply auth and permission resolve to all role routes
router.use(requireAuth, resolvePermissions);

// Anyone with manage_roles or manage_users can see roles
router.get('/roles', RolesController.getRoles);

// Only manage_roles can modify
router.post('/roles', requirePermission('manage_roles'), RolesController.createRole);
router.patch('/roles/:id', requirePermission('manage_roles'), RolesController.updateRole);
router.delete('/roles/:id', requirePermission('manage_roles'), RolesController.deleteRole);

router.post('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);
router.delete('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);

export default router;
