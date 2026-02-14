import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';
import { logger } from '../utils/logger';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized: No session provided' });
    }

    const session = await sessionService.getSession(sessionId);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized: Invalid session' });
    }

    // Sliding Expiration: Refresh session TTL
    await sessionService.refreshSession(sessionId);

    req.user = { id: session.userId };
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
