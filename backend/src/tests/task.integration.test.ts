import request from 'supertest';
import app from '../app';
import { db } from '../services/db.service';
import { redisService } from '../services/redis.service';
import { sessionService } from '../services/session.service';
import bcrypt from 'bcrypt';

const MOCK_PASSWORD = 'password123';
const MOCK_COOKIE_NAME = 'sessionId';

describe('Task API Integration Tests - getTasksByProject', () => {
  let user: any;
  let project: any;
  let sessionToken: string;

  beforeAll(async () => {
    await redisService.connect();
    await db.task.deleteMany();
    await db.projectActivity.deleteMany();
    await db.projectMember.deleteMany();
    await db.project.deleteMany();
    await db.user.deleteMany();

    const hashedPassword = await bcrypt.hash(MOCK_PASSWORD, 10);
    user = await db.user.create({
      data: {
        email: 'test-task-integration@example.com',
        name: 'Task Tester',
        password_hash: hashedPassword,
      },
    });

    sessionToken = await sessionService.createSession(user.id);

    project = await db.project.create({
      data: {
        name: 'Integration Project',
        description: 'Test project for tasks endpoint',
        owner_id: user.id,
      },
    });
  });

  afterAll(async () => {
    await db.task.deleteMany();
    await db.projectActivity.deleteMany();
    await db.projectMember.deleteMany();
    await db.project.deleteMany();
    await db.user.deleteMany();

    if (sessionToken) {
      await sessionService.deleteSession(sessionToken);
    }
    await redisService.quit();
  });

  beforeEach(async () => {
    await db.task.deleteMany();
  });

  it('should return 401 if unauthorized', async () => {
    const res = await request(app).get(`/api/v1/projects/${project.id}/tasks`);
    expect(res.status).toBe(401);
  });

  it('should return 400 for invalid project ID format', async () => {
    const res = await request(app)
      .get('/api/v1/projects/invalid-id/tasks')
      .set('Cookie', [`${MOCK_COOKIE_NAME}=${sessionToken}`]);
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return an empty array if project has 0 tasks', async () => {
    const res = await request(app)
      .get(`/api/v1/projects/${project.id}/tasks`)
      .set('Cookie', [`${MOCK_COOKIE_NAME}=${sessionToken}`]);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });

  it('should return correct pagination metadata and tasks when there are items', async () => {
    await db.task.create({
      data: {
        title: 'Task 1',
        project_id: project.id,
        status: 'todo',
      },
    });

    await db.task.create({
      data: {
        title: 'Task 2',
        project_id: project.id,
        status: 'in_progress',
      },
    });

    const res = await request(app)
      .get(`/api/v1/projects/${project.id}/tasks?limit=1`)
      .set('Cookie', [`${MOCK_COOKIE_NAME}=${sessionToken}`]);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.totalPages).toBe(2);
  });
});
