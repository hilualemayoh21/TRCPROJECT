import { Router } from 'express';
import { AdminController } from './admin.controller';
import { RolesController } from '../roles/roles.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth, resolvePermissions);

// Roles
router.get('/roles', RolesController.getRoles);
router.post('/roles', requirePermission('manage_roles'), RolesController.createRole);
router.patch('/roles/:id', requirePermission('manage_roles'), RolesController.updateRole);
router.delete('/roles/:id', requirePermission('manage_roles'), RolesController.deleteRole);
router.post('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);
router.delete('/roles/:id/permissions', requirePermission('manage_roles'), RolesController.togglePermission);

// Dashboard
router.get('/analytics/overview', requirePermission('view_dashboard'), AdminController.getDashboard);

// Researcher management
router.get('/researchers/requests', requirePermission('manage_users'), AdminController.listResearcherRequests);
router.post('/researchers/:id/approve', requirePermission('manage_users'), AdminController.approveResearcher);
router.post('/researchers/:id/reject', requirePermission('manage_users'), AdminController.rejectResearcher);

// Pending resources
router.get('/resources/pending', requirePermission('approve_resources'), AdminController.listPendingResources);

// Reports
router.get('/reports', requirePermission('resolve_reports'), AdminController.listReports);
router.post('/reports/:id/resolve', requirePermission('resolve_reports'), AdminController.resolveReport);

export default router;
