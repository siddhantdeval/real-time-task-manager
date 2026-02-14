import { redisService } from './redis.service';
import { config } from '../config';
import { logger } from '../utils/logger';
import crypto from 'crypto';

class SessionService {
  private get redis() {
    return redisService.getClient();
  }

  private getKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  public async createSession(userId: string): Promise<string> {
    const sessionId = crypto.randomUUID();
    const key = this.getKey(sessionId);
    const sessionData = {
      userId,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.redis.set(
        key,
        JSON.stringify(sessionData),
        'EX',
        config.sessionTTL
      );
      return sessionId;
    } catch (error) {
      logger.error('Failed to create session:', error);
      throw new Error('Session creation failed');
    }
  }

  public async getSession(sessionId: string): Promise<{ userId: string; createdAt: string } | null> {
    const key = this.getKey(sessionId);
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to get session:', error);
      return null;
    }
  }

  public async refreshSession(sessionId: string): Promise<void> {
    const key = this.getKey(sessionId);
    try {
      await this.redis.expire(key, config.sessionTTL);
    } catch (error) {
      logger.error('Failed to refresh session:', error);
    }
  }

  public async deleteSession(sessionId: string): Promise<void> {
    const key = this.getKey(sessionId);
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Failed to delete session:', error);
    }
  }
}

export const sessionService = new SessionService();
