import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth, resolvePermissions);

router.get('/dashboard', requirePermission('view_dashboard'), AdminController.getDashboard);
router.get('/researchers/requests', requirePermission('manage_users'), AdminController.listResearcherRequests);
router.get('/resources/pending', requirePermission('approve_resources'), AdminController.listPendingResources);
router.get('/reports', requirePermission('resolve_reports'), AdminController.listReports);
router.post('/reports/:id/resolve', requirePermission('resolve_reports'), AdminController.resolveReport);

export default router;
