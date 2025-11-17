import { Router } from 'express';
import * as ctrl from '../controllers/product.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { productSchema } from '../validators/schemas';

const router: Router = Router();

router.post('/', requireAuth, requireRole('admin'), validateBody(productSchema), ctrl.createProduct);
router.put('/:id', requireAuth, requireRole('admin'), validateBody(productSchema), ctrl.updateProduct);

export default router;
