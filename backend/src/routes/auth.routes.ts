import { Router } from 'express';
import { register, login, googleLogin, logout, getMe } from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema, googleLoginSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
