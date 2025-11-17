import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/cart.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { cartItemSchema } from '../validators/schemas';

const router: Router = Router();

router.use(requireAuth);

router.get('/', ctrl.getCart);
router.post('/add', validateBody(cartItemSchema), ctrl.addToCart);

export default router;
