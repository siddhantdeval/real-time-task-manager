import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config';
import { asyncHandler } from '../utils/asyncHandler';
import { sessionService } from '../services/session.service';
import { Utils } from '../utils';

const setSessionCookie = (res: Response, sessionId: string) => {
  res.cookie(Utils.getCookieName(), sessionId, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: config.sessionTTL * 1000,
    path: '/',
  });
};

const clearSessionCookie = (res: Response) => {
  res.clearCookie(Utils.getCookieName(), {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    path: '/',
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.registerUser(email, password);
  res.status(201).json({ message: 'User registered successfully', user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  // OWASP: Session Fixation Prevention
  // Destroy any existing anonymous or older session before the new login
  const existingSessionId = req.cookies[Utils.getCookieName()];
  if (existingSessionId) {
    await sessionService.deleteSession(existingSessionId);
  }

  const { email, password } = req.body;
  const { user, sessionId } = await authService.loginUser(email, password);

  setSessionCookie(res, sessionId);

  res.status(200).json({ message: 'Login successful', user });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  // OWASP: Session Fixation Prevention
  const existingSessionId = req.cookies[Utils.getCookieName()];
  if (existingSessionId) {
    await sessionService.deleteSession(existingSessionId);
  }

  const { token } = req.body;
  const { user, sessionId } = await authService.loginWithGoogle(token);

  setSessionCookie(res, sessionId);

  res.status(200).json({ message: 'Google login successful', user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.cookies[Utils.getCookieName()];
  if (sessionId) {
    await authService.logoutUser(sessionId);
  }

  clearSessionCookie(res);

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
