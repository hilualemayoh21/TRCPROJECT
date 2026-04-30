import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const authRateLimiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000,
  max: config.rateLimitMax,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: `Too many attempts, please try again in ${config.rateLimitWindow} minutes.`,
      details: {}
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
