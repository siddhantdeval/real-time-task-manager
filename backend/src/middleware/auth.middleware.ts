import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';
import { logger } from '../utils/logger';
import { Utils } from '../utils';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies[Utils.getCookieName()];

    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized: No session provided' });
    }

    const session = await sessionService.getSession(sessionId);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }

    // OWASP: Absolute Timeout Enforcement
    if (session.absoluteExpiry && new Date(session.absoluteExpiry) < new Date()) {
       // Session has lived past its absolute maximum TTL
       await sessionService.deleteSession(sessionId);
       res.clearCookie('sessionId'); // Also clear the explicit name if in dev
       res.clearCookie('__Host-sessionId');
       return res.status(401).json({ message: 'Unauthorized: Session expired (Absolute Timeout)' });
    }

    // Sliding Expiration: Refresh session TTL (Idle timeout)
    await sessionService.refreshSession(sessionId);

    req.user = { id: session.userId };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
