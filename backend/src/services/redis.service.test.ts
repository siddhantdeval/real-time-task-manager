import { redisService } from './redis.service';

// Mock config module to point to the test Redis instance
jest.mock('../config', () => ({
  config: {
    env: 'test',
    redis: {
      url: 'redis://localhost:6380',
    },
    // Mock other required config values to prevent errors in dependent modules (like logger)
    logLevel: 'error', 
    port: 3000,
    db: { url: 'postgres://user:pass@localhost:5432/db' },
    jwt: { secret: 'secret' },
  },
}));

describe('Redis Service Integration', () => {
  // Connect before all tests
  beforeAll(async () => {
    // Ensure we are connected
    await redisService.connect();
  });

  // Cleanup after all tests
  afterAll(async () => {
    await redisService.quit();
  });

  // Cleanup after each test
  afterEach(async () => {
    const client = redisService.getClient();
    await client.flushall();
  });

  it('should connect to Redis and respond to PING', async () => {
    const isHealthy = await redisService.healthCheck();
    expect(isHealthy).toBe(true);
  });

  it('should perform SET and GET operations correctly', async () => {
    const client = redisService.getClient();
    const key = 'test:key';
    const value = 'test-value';

    await client.set(key, value);
    const retrievedValue = await client.get(key);

    expect(retrievedValue).toBe(value);
  });

  it('should handle expiry correctly', async () => {
    const client = redisService.getClient();
    const key = 'test:expiry';
    const value = 'expiry-value';
    const ttlSeconds = 1;

    // Set with expiry
    await client.set(key, value, 'EX', ttlSeconds);

    // Should exist immediately
    const existsBefore = await client.get(key);
    expect(existsBefore).toBe(value);

    // Wait for expiry + buffer
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Should not exist after expiry
    const existsAfter = await client.get(key);
    expect(existsAfter).toBeNull();
  });
});
