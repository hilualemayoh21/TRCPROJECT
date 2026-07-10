import { Router } from 'express';
import { AuditController } from './audit.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';
import { requirePermission, resolvePermissions } from '../../middleware/rbac.middleware';

const router = Router();

router.use(requireAuth, requireVerifiedEmail, resolvePermissions);

router.get('/audit-logs', requirePermission('view_audit_logs'), AuditController.listLogs);
router.post('/audit-log', AuditController.createLog);

export default router;
