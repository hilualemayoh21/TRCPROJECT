import { Router } from 'express';
import { ResourcesController } from './resources.controller';
import { requireAuth, requireVerifiedEmail, requireActiveAccount } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

// ── Public routes (no auth) ──
router.get('/', ResourcesController.list);
router.get('/:id', ResourcesController.getById);
router.get('/:id/comments', ResourcesController.getComments);

// ── Authenticated routes ──
router.post('/', requireAuth, requireVerifiedEmail, requireActiveAccount, resolvePermissions, requirePermission('create_resources'), ResourcesController.create);
router.patch('/:id', requireAuth, requireVerifiedEmail, requireActiveAccount, resolvePermissions, ResourcesController.update);
router.delete('/:id', requireAuth, requireVerifiedEmail, requireActiveAccount, resolvePermissions, ResourcesController.delete);
router.post('/:id/comments', requireAuth, requireVerifiedEmail, requireActiveAccount, ResourcesController.addComment);
router.post('/:id/rate', requireAuth, requireVerifiedEmail, requireActiveAccount, ResourcesController.rate);
router.post('/:id/report', requireAuth, requireVerifiedEmail, requireActiveAccount, ResourcesController.report);

// ── Admin routes ──
router.post('/:id/approve', requireAuth, requireVerifiedEmail, resolvePermissions, requirePermission('approve_resources'), ResourcesController.approve);
router.post('/:id/reject', requireAuth, requireVerifiedEmail, resolvePermissions, requirePermission('approve_resources'), ResourcesController.reject);

export default router;
