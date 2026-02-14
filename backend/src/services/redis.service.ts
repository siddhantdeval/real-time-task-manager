import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

class RedisService {
  private client: Redis | null = null;

  public async connect(): Promise<Redis> {
    if (this.client) return this.client;

    const redisUrl = config.redis.url;
    
    // Safety check
    if (!redisUrl) {
      logger.error('Redis URL is not defined in configuration');
      process.exit(1);
    }

    logger.info('Initializing Redis client...');

    this.client = new Redis(redisUrl, {
      lazyConnect: true, // We will manually connect
      maxRetriesPerRequest: null, // Allow unlimited retries for commands during reconnection
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 100, 3000); // Exponential backoff capped at 3s
        logger.warn(`Redis retry attempt ${times}. Retrying in ${delay}ms...`);
        return delay;
      },
    });

    // Event Logging
    this.client.on('connect', () => logger.info('Redis: Connection detected'));
    this.client.on('ready', () => logger.info('Redis: Client is ready'));
    this.client.on('error', (err) => logger.error('Redis: Connection Error:', err));
    this.client.on('close', () => logger.warn('Redis: Connection closed'));
    this.client.on('reconnecting', () => logger.info('Redis: Reconnecting...'));
    this.client.on('end', () => logger.info('Redis: Connection ended'));

    try {
      await this.client.connect();
      logger.info('Redis: Successfully connected to server');

      // PING Test
      const pingResponse = await this.client.ping();
      logger.info(`Redis PING response: ${pingResponse}`); // Should be 'PONG'

      return this.client;
    } catch (error) {
      logger.error('FATAL: Could not establish initial connection to Redis');
      logger.error(error);
      process.exit(1); // Fail clearly
    }
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }

  /**
   * Gracefully close the Redis connection.
   * key feature: Handles potential race conditions by checking client existence.
   */
  public async quit(): Promise<void> {
    if (this.client) {
      logger.info('Redis: Closing connection...');
      try {
        await this.client.quit();
      } catch (error) {
        // Ignore errors during quit, as we are shutting down anyway
        logger.warn('Redis: Error during quit:', error);
      }
      this.client = null;
      logger.info('Redis: Connection closed gracefully');
    }
  }
  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.client) return false;
      const response = await this.client.ping();
      return response === 'PONG';
    } catch (error) {
      logger.error('Redis: Health check failed', error);
      return false;
    }
  }
}

export const redisService = new RedisService();
