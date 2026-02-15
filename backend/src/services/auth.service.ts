import { dbService } from './db.service';
import { hashPassword, comparePassword } from '../utils/password';
import { sessionService } from './session.service';
import { verifyGoogleToken } from './google.auth.service';
import { logger } from '../utils/logger';

class AuthService {
  private get db() {
    return dbService.client;
  }

  public async registerUser(email: string, password: string): Promise<any> {
    const existingUser = await this.db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const user = await this.db.user.create({
      data: {
        email,
        password_hash: hashedPassword,
      },
    });

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public async loginUser(email: string, password: string): Promise<{ user: any; sessionId: string }> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user || !user.password_hash) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const sessionId = await sessionService.createSession(user.id);
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, sessionId };
  }

  public async loginWithGoogle(token: string): Promise<{ user: any; sessionId: string }> {
    try {
      const payload = await verifyGoogleToken(token);
      if (!payload || !payload.email) {
        throw new Error('Invalid Google token');
      }

      let user = await this.db.user.findUnique({ where: { email: payload.email } });

      if (!user) {
        user = await this.db.user.create({
          data: {
            email: payload.email,
            google_id: payload.sub,
            avatar_url: payload.picture,
            password_hash: null, // explicit null for Google users
          },
        });
      } else if (!user.google_id) {
        // Link Google account if email exists but no google_id
        user = await this.db.user.update({
          where: { id: user.id },
          data: {
            google_id: payload.sub,
            avatar_url: payload.picture || user.avatar_url,
          },
        });
      }

      const sessionId = await sessionService.createSession(user.id);
      const { password_hash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, sessionId };
    } catch (error) {
        logger.error('Google login failed:', error);
        throw new Error('Google login failed');
    }
  }

  public async logoutUser(sessionId: string): Promise<void> {
    await sessionService.deleteSession(sessionId);
  }

  public async getUserProfile(userId: string): Promise<any> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, avatar_url: true, created_at: true },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    return user;
  }
}


export const authService = new AuthService();
