import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../validators/schemas';

const router: Router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;
