import { NextFunction, Request, Response } from 'express';
import { config } from '../config';

export class Utils {
  static getCookieName() {
    // OWASP: Use __Host- prefix in production for strict scoping.
    // Dev usually runs on HTTP / localhost so the prefix won't work there.
    return config.env === 'production' ? '__Host-sessionId' : 'sessionId';
  }

  static asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}
