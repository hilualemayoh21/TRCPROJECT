import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from './auth.controller';
import { requireAuth, requireVerifiedEmail } from '../../middleware/auth.middleware';

const router = Router();

const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Please wait before requesting another verification code.',
      details: {}
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/resend-verification', resendVerificationLimiter, AuthController.resendVerification);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/researcher-info', requireAuth, requireVerifiedEmail, AuthController.submitResearcherInfo);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', requireAuth, AuthController.me);

export default router;
