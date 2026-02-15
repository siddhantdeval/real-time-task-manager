import request from 'supertest';
import app from '../app';
import { dbService } from '../services/db.service';
import { redisService } from '../services/redis.service';

describe('Task Integration Tests', () => {
  let userId: string;
  let projectId: string;
  let taskId: string;
  let authCookie: string[];

  beforeAll(async () => {
    await dbService.connect();
    await redisService.connect();
  });

  afterAll(async () => {
    await dbService.disconnect();
    await redisService.quit();
  });

  beforeEach(async () => {
    // Clean up
    await dbService.client.task.deleteMany();
    await dbService.client.project.deleteMany();
    await dbService.client.user.deleteMany();
    await redisService.getClient().flushall();

    // Create a test user and login
    const userPayload = { email: 'test@example.com', password: 'password123' };
    await request(app).post('/api/v1/auth/register').send(userPayload);
    const loginRes = await request(app).post('/api/v1/auth/login').send(userPayload);
    authCookie = loginRes.headers['set-cookie'] as unknown as string[];
    userId = loginRes.body.user.id;

    // Create a test project
    const projectRes = await dbService.client.project.create({
      data: {
        name: 'Test Project',
        owner_id: userId,
      },
    });
    projectId = projectRes.id;
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task successfully', async () => {
      const payload = {
        title: 'Integration Test Task',
        description: 'Test description',
        status: 'todo',
        priority: 'high',
        project_id: projectId,
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Cookie', authCookie)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      taskId = res.body.data.id;
    });

    it('should fail with invalid payload (title too short)', async () => {
      const payload = {
        title: 'Ab',
        project_id: projectId,
      };

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Cookie', authCookie)
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContain('Title must be at least 3 characters long');
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should fetch a task by ID', async () => {
      const task = await dbService.client.task.create({
        data: { title: 'Fetch Me', project_id: projectId },
      });

      const res = await request(app)
        .get(`/api/v1/tasks/${task.id}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Fetch Me');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update task details', async () => {
      const task = await dbService.client.task.create({
        data: { title: 'Old Title', project_id: projectId },
      });

      const res = await request(app)
        .put(`/api/v1/tasks/${task.id}`)
        .set('Cookie', authCookie)
        .send({ title: 'New Updated Title' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('New Updated Title');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete a task', async () => {
      const task = await dbService.client.task.create({
        data: { title: 'Delete Me', project_id: projectId },
      });

      const res = await request(app)
        .delete(`/api/v1/tasks/${task.id}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully');

      const checkTask = await dbService.client.task.findUnique({ where: { id: task.id } });
      expect(checkTask).toBeNull();
    });
  });
});
