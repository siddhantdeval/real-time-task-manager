import { Router } from 'express';
import { register, login, googleLogin, logout, getMe, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema, googleLoginSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
