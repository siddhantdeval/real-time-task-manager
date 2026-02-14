import app from './app';
import { config } from './config';
import { redisService } from './services/redis.service';

import { dbService } from './services/db.service';

const startServer = async () => {
  try {
    // Initialize Redis connection
    await redisService.connect();
    // Initialize DB connection
    await dbService.connect();

    const PORT = config.port;

    const server = app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`, {
        timestamp: new Date().toISOString(),
        env: config.env,
        nodeVersion: process.version,
      });
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await Promise.all([
            redisService.quit(),
            dbService.disconnect()
          ]);
          console.log('Graceful shutdown completed.');
          process.exit(0);
        } catch (error) {
          console.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
