import { Request, Response } from 'express';
import { redisService } from '../services/redis.service';
import { dbService } from '../services/db.service';

export class HealthController {
  public async getHealth(req: Request, res: Response): Promise<void> {
    const redisHealthy = await redisService.healthCheck();
    const dbHealthy = await dbService.healthCheck();

    const status = redisHealthy && dbHealthy ? 'ok' : 'error';
    const statusCode = redisHealthy && dbHealthy ? 200 : 503;

    res.status(statusCode).json({
      status,
      timestamp: new Date().toISOString(),
      services: {
        redis: redisHealthy ? 'up' : 'down',
        database: dbHealthy ? 'up' : 'down',
      },
      uptime: process.uptime(),
    });
  }
}
