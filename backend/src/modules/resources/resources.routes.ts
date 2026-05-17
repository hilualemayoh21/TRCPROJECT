import { Router } from 'express';
import { ResourcesController } from './resources.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// ── Public routes (no auth) ──
router.get('/', ResourcesController.list);
router.get('/:id', ResourcesController.getById);
router.get('/:id/comments', ResourcesController.getComments);

// ── Authenticated routes ──
router.post('/', requireAuth, resolvePermissions, requirePermission('create_resources'), ResourcesController.create);
router.patch('/:id', requireAuth, resolvePermissions, ResourcesController.update);
router.delete('/:id', requireAuth, resolvePermissions, ResourcesController.delete);
router.post('/:id/comments', requireAuth, ResourcesController.addComment);
router.post('/:id/rate', requireAuth, ResourcesController.rate);
router.post('/:id/report', requireAuth, ResourcesController.report);

// ── Admin routes ──
router.post('/:id/approve', requireAuth, resolvePermissions, requirePermission('approve_resources'), ResourcesController.approve);
router.post('/:id/reject', requireAuth, resolvePermissions, requirePermission('approve_resources'), ResourcesController.reject);

export default router;
