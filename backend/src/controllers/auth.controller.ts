import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config';
import { logger } from '../utils/logger';

const setSessionCookie = (res: Response, sessionId: string) => {
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: config.env === 'production', // Secure in production
    sameSite: 'strict',
    maxAge: config.sessionTTL * 1000, // Convert seconds to milliseconds
    path: '/',
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, sessionId } = await authService.loginUser(email, password);
    
    setSessionCookie(res, sessionId);
    
    res.status(200).json({ message: 'Login successful', user });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const { user, sessionId } = await authService.loginWithGoogle(token);

    setSessionCookie(res, sessionId);

    res.status(200).json({ message: 'Google login successful', user });
  } catch (error: any) {
    if (error.message === 'Invalid Google token' || error.message === 'Google login failed') {
      return res.status(401).json({ message: 'Google authentication failed' });
    }
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await authService.logoutUser(sessionId);
    }
    
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await authService['db'].user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, avatar_url: true, created_at: true }
    });
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
