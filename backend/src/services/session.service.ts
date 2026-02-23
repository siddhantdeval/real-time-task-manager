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
    // OWASP: 256-bit CSPRNG Entropy
    const sessionId = crypto.randomBytes(32).toString('hex');
    const key = this.getKey(sessionId);
    
    // Track concurrent user sessions in a Redis Set
    const userSessionsKey = `user:sessions:${userId}`;
    
    // Calculate absolute expiration for forced re-authentication
    const absoluteExpiry = new Date(Date.now() + config.absoluteSessionTTL * 1000).toISOString();
    
    const sessionData = {
      userId,
      createdAt: new Date().toISOString(),
      absoluteExpiry,
    };

    try {
      const pipeline = this.redis.pipeline();
      pipeline.set(key, JSON.stringify(sessionData), 'EX', config.sessionTTL);
      pipeline.sadd(userSessionsKey, sessionId);
      // Optional: Set an absolute expire on the Set itself as a safety net
      pipeline.expire(userSessionsKey, config.absoluteSessionTTL);
      await pipeline.exec();

      return sessionId;
    } catch (error) {
      logger.error('Failed to create session:', error);
      throw new Error('Session creation failed');
    }
  }

  // Make sure we include absoluteExpiry in the return type
  public async getSession(sessionId: string): Promise<{ userId: string; createdAt: string; absoluteExpiry: string } | null> {
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
      // Small race condition optimization: read to find user to clear from Set
      const sessionData = await this.getSession(sessionId);
      
      const pipeline = this.redis.pipeline();
      pipeline.del(key);
      
      if (sessionData && sessionData.userId) {
        pipeline.srem(`user:sessions:${sessionData.userId}`, sessionId);
      }
      
      await pipeline.exec();
    } catch (error) {
      logger.error('Failed to delete session:', error);
    }
  }

  // OWASP: Force terminate all sessions for a user (e.g. password reset)
  public async deleteAllUserSessions(userId: string): Promise<void> {
    const userSessionsKey = `user:sessions:${userId}`;
    try {
      const sessionIds = await this.redis.smembers(userSessionsKey);
      if (sessionIds.length > 0) {
        const pipeline = this.redis.pipeline();
        sessionIds.forEach(id => {
          pipeline.del(this.getKey(id));
        });
        pipeline.del(userSessionsKey);
        await pipeline.exec();
      }
    } catch (error) {
       logger.error('Failed to delete all user sessions:', error);
    }
  }
}

export const sessionService = new SessionService();
