import { PrismaClient } from '../generated/prisma';
import { config } from '../config';
import { logger } from '../utils/logger';

// Define the threshold for slow queries (in milliseconds)
const SLOW_QUERY_THRESHOLD = 100;

// Initialize Prisma Client with log levels
const prismaClient = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
  datasources: {
    db: {
      url: config.db.url,
    },
  },
});

// Extend Prisma Client for query timing
const db = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now();
        const result = await query(args);
        const end = performance.now();
        const duration = end - start;

        if (duration > SLOW_QUERY_THRESHOLD) {
          logger.warn('Slow Query Detected', {
            model,
            operation,
            duration_ms: Math.round(duration),
            args,
          });
        }

        return result;
      },
    },
  },
});

// Setup event listeners for connection monitoring
prismaClient.$on('query', (e) => {
  // Uncomment to log all queries
  // logger.debug(`Query: ${e.query} Duration: ${e.duration}ms`);
});

prismaClient.$on('info', (e) => {
  logger.info(e.message, {
    timestamp: e.timestamp,
    target: e.target,
  });
});

prismaClient.$on('warn', (e) => {
  logger.warn(e.message, {
    timestamp: e.timestamp,
    target: e.target,
  });
});

prismaClient.$on('error', (e) => {
  logger.error(e.message, {
    timestamp: e.timestamp,
    target: e.target,
  });
});

// DB Service Methods
const connect = async () => {
  try {
    await prismaClient.$connect();
    logger.info('Database: Successfully connected');
  } catch (error) {
    logger.error('Database: Connection failed', error);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await prismaClient.$disconnect();
    logger.info('Database: Disconnected gracefully');
  } catch (error) {
    logger.error('Database: Disconnect failed', error);
  }
};

const healthCheck = async (): Promise<boolean> => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database: Health check failed', error);
    return false;
  }
};

export const dbService = {
  client: db,
  connect,
  disconnect,
  healthCheck,
};
export { db };
export type DBClient = typeof db;
