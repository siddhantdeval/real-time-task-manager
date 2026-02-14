import request from 'supertest';
import app from '../app';
import { dbService } from '../services/db.service';
import { redisService } from '../services/redis.service';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await dbService.connect();
    await redisService.connect();
  });

  afterAll(async () => {
    await dbService.disconnect();
    await redisService.quit();
  });

  beforeEach(async () => {
    // Clear User table
    await dbService.client.user.deleteMany();
    // Clear Redis
    await redisService.getClient().flushall();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'password123',
  };

  let sessionId = '';

  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty('password_hash');
  });

  it('should login and return a session cookie', async () => {
    // Register first
    await request(app).post('/api/v1/auth/register').send(testUser);

    const res = await request(app).post('/api/v1/auth/login').send(testUser);
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    
    // Extract session ID from cookie
    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies).toBeDefined();
    const sessionCookie = cookies.find((c: string) => c.startsWith('sessionId='));
    expect(sessionCookie).toBeDefined();
    if (sessionCookie) {
      sessionId = sessionCookie.split(';')[0].split('=')[1];
    }
  });

  it('should get current user with valid session', async () => {
    // Register & Login
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send(testUser);
    const cookies = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should fail to get user without session', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('should logout and invalidate session', async () => {
    // Register & Login
    await request(app).post('/api/v1/auth/register').send(testUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send(testUser);
    const cookies = loginRes.headers['set-cookie'];

    // Logout
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', cookies);
    
    expect(logoutRes.status).toBe(200);
    expect(logoutRes.headers['set-cookie'][0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    // Try accessing /me
    const meRes = await request(app)
      .get('/api/v1/auth/me')
      .set('Cookie', cookies); // Sending the old cookie
    
    expect(meRes.status).toBe(401);
  });
});
