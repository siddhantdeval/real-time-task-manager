import app from './app';
import { config } from './config';
import { redisService } from './services/redis.service';

const startServer = async () => {
  try {
    // Initialize Redis connection
    await redisService.connect();

    const PORT = config.port;

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
