import { Router } from 'express';
import { PublicController } from './public.controller';

const router = Router();

// All public — no auth required
router.get('/stats', PublicController.getStats);
router.get('/featured', PublicController.getFeatured);
router.get('/categories', PublicController.getCategories);

export default router;
