import { Router } from 'express';
import { AdminController } from './admin.controller';
import { RolesController } from '../roles/roles.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth, requireVerifiedEmail, resolvePermissions);

// Roles
router.get('/roles', requirePermission('view_roles'), RolesController.getRoles);
router.post('/roles', requirePermission('create_roles'), RolesController.createRole);
router.patch('/roles/:id', requirePermission('update_roles'), RolesController.updateRole);
router.delete('/roles/:id', requirePermission('delete_roles'), RolesController.deleteRole);
router.post('/roles/:id/permissions', requirePermission('update_roles'), RolesController.togglePermission);
router.delete('/roles/:id/permissions', requirePermission('update_roles'), RolesController.togglePermission);

// Dashboard
router.get('/analytics/overview', requirePermission('view_dashboard'), AdminController.getDashboard);

// Researcher management
router.get('/researchers/requests', requirePermission('view_researchers'), AdminController.listResearcherRequests);
router.post('/researchers/:id/approve', requirePermission('approve_researchers'), AdminController.approveResearcher);
router.post('/researchers/:id/reject', requirePermission('approve_researchers'), AdminController.rejectResearcher);

// Pending resources
router.get('/resources/pending', requirePermission('approve_resources'), AdminController.listPendingResources);

// Reports
router.get('/reports', requirePermission('view_reports'), AdminController.listReports);
router.post('/reports/:id/resolve', requirePermission('resolve_reports'), AdminController.resolveReport);

export default router;
