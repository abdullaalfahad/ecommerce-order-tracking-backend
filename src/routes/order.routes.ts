import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/order.controller';

const router: Router = Router();

router.post('/create', requireAuth, ctrl.createOrderFromCart);

export default router;
