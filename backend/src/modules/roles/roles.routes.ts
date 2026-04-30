import { Router } from 'express';
import { RolesController } from './roles.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// Apply auth and permission checks to all role routes
router.use(requireAuth, resolvePermissions, requirePermission('manage_roles'));

router.get('/', RolesController.getRoles);
router.post('/', RolesController.createRole);
router.patch('/:id', RolesController.updateRole);
router.delete('/:id', RolesController.deleteRole);

router.post('/:id/permissions', RolesController.togglePermission);
router.delete('/:id/permissions', RolesController.togglePermission);

export default router;
