import { PrismaClient } from '../generated/prisma';
import { config } from '../config';

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
          console.warn(JSON.stringify({
            level: 'warn',
            message: 'Slow Query Detected',
            timestamp: new Date().toISOString(),
            model,
            operation,
            duration_ms: Math.round(duration),
            args,
          }));
        }

        return result;
      },
    },
  },
});

// Setup event listeners for connection monitoring
prismaClient.$on('query', (e) => {
  // Uncomment to log all queries
  // console.log(`Query: ${e.query} Duration: ${e.duration}ms`);
});

prismaClient.$on('info', (e) => {
  console.info(JSON.stringify({
    level: 'info',
    message: e.message,
    timestamp: e.timestamp,
    target: e.target,
  }));
});

prismaClient.$on('warn', (e) => {
  console.warn(JSON.stringify({
    level: 'warn',
    message: e.message,
    timestamp: e.timestamp,
    target: e.target,
  }));
});

prismaClient.$on('error', (e) => {
  console.error(JSON.stringify({
    level: 'error',
    message: e.message,
    timestamp: e.timestamp,
    target: e.target,
  }));
});

// DB Service Methods
const connect = async () => {
  try {
    await prismaClient.$connect();
    console.log('Database: Successfully connected');
  } catch (error) {
    console.error('Database: Connection failed', error);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await prismaClient.$disconnect();
    console.log('Database: Disconnected gracefully');
  } catch (error) {
    console.error('Database: Disconnect failed', error);
  }
};

const healthCheck = async (): Promise<boolean> => {
  try {
    await prismaClient.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database: Health check failed', error);
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
