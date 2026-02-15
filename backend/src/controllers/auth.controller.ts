import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config';
import { asyncHandler } from '../utils/asyncHandler';

const setSessionCookie = (res: Response, sessionId: string) => {
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: config.sessionTTL * 1000,
    path: '/',
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  res.status(201).json({ message: 'User registered successfully', user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, sessionId } = await authService.loginUser(email, password);
  
  setSessionCookie(res, sessionId);
  
  res.status(200).json({ message: 'Login successful', user });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const { user, sessionId } = await authService.loginWithGoogle(token);

  setSessionCookie(res, sessionId);

  res.status(200).json({ message: 'Google login successful', user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
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
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await authService.getUserProfile(userId);
  res.status(200).json({ user });
});

