import { Router } from 'express';
import { ResourcesController } from './resources.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// ── Public routes (no auth) ──
router.get('/', ResourcesController.list);
router.get('/:id', ResourcesController.getById);
router.get('/:id/comments', ResourcesController.getComments);

// ── Authenticated routes ──
router.post('/', requireAuth, requireVerifiedEmail, resolvePermissions, requirePermission('create_resources'), ResourcesController.create);
router.patch('/:id', requireAuth, requireVerifiedEmail, resolvePermissions, ResourcesController.update);
router.delete('/:id', requireAuth, requireVerifiedEmail, resolvePermissions, ResourcesController.delete);
router.post('/:id/comments', requireAuth, requireVerifiedEmail, ResourcesController.addComment);
router.post('/:id/rate', requireAuth, requireVerifiedEmail, ResourcesController.rate);
router.post('/:id/report', requireAuth, requireVerifiedEmail, ResourcesController.report);

// ── Admin routes ──
router.post('/:id/approve', requireAuth, requireVerifiedEmail, resolvePermissions, requirePermission('approve_resources'), ResourcesController.approve);
router.post('/:id/reject', requireAuth, requireVerifiedEmail, resolvePermissions, requirePermission('approve_resources'), ResourcesController.reject);

export default router;
