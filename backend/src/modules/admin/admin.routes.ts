import { Router } from 'express';
import { AdminController } from './admin.controller';
import { RolesController } from '../roles/roles.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth, resolvePermissions);

router.get('/roles', RolesController.getRoles);
router.post('/roles', requirePermission('manage_roles'), RolesController.createRole);
router.patch('/roles/:id', requirePermission('manage_roles'), RolesController.updateRole);
router.delete('/roles/:id', requirePermission('manage_roles'), RolesController.deleteRole);
router.post('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);
router.delete('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);

router.get('/analytics/overview', requirePermission('view_dashboard'), AdminController.getDashboard);
router.get('/researchers/requests', requirePermission('manage_users'), AdminController.listResearcherRequests);
router.get('/resources/pending', requirePermission('approve_resources'), AdminController.listPendingResources);
router.get('/reports', requirePermission('resolve_reports'), AdminController.listReports);
router.post('/reports/:id/resolve', requirePermission('resolve_reports'), AdminController.resolveReport);

export default router;
