import { taskService } from './task.service';
import { db } from './db.service';
import { redisService } from './redis.service';
import { logger } from '../utils/logger';

// Mock Dependencies
jest.mock('./redis.service', () => ({
  redisService: {
    healthCheck: jest.fn(),
    getClient: jest.fn(),
  },
}));

jest.mock('./db.service', () => ({
  db: {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('TaskService Unit Tests', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: 'todo',
    priority: 'medium',
    project_id: 'project-1',
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  };

  const mockProject = {
    id: 'project-1',
    owner_id: 'user-1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks with filters successfully', async () => {
      const tasks = [mockTask];
      (db.task.findMany as jest.Mock).mockResolvedValue(tasks);

      const filter = { project_id: 'project-1' };
      const result = await taskService.getAllTasks(filter);

      expect(db.task.findMany).toHaveBeenCalledWith({
        where: filter,
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('getTaskById', () => {
    let mockRedisGet: jest.Mock;
    let mockRedisSetex: jest.Mock;

    beforeEach(() => {
      mockRedisGet = jest.fn();
      mockRedisSetex = jest.fn().mockResolvedValue('OK');
      
      (redisService.healthCheck as jest.Mock).mockResolvedValue(true);
      (redisService.getClient as jest.Mock).mockReturnValue({
        get: mockRedisGet,
        setex: mockRedisSetex,
      });
    });

    it('should return cached task if found in Redis (HIT)', async () => {
      mockRedisGet.mockResolvedValue(JSON.stringify(mockTask));
      
      const result = await taskService.getTaskById('task-1');
      
      expect(mockRedisGet).toHaveBeenCalledWith('task:task-1');
      expect(db.task.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(JSON.parse(JSON.stringify(mockTask))); // Date becomes string in JSON
    });

    it('should query DB and set cache if not found in Redis (MISS)', async () => {
      mockRedisGet.mockResolvedValue(null);
      (db.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('task-1');

      expect(mockRedisGet).toHaveBeenCalledWith('task:task-1');
      expect(db.task.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
      
      // Wait for async setex to complete
      await new Promise(process.nextTick);
      expect(mockRedisSetex).toHaveBeenCalled();
    });

    it('should fallback to DB and log warn if cache contains malformed JSON', async () => {
      mockRedisGet.mockResolvedValue('invalid-json');
      (db.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('task-1');

      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Malformed JSON in cache'));
      expect(db.task.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should fallback to DB and log error if Redis get throws', async () => {
      mockRedisGet.mockRejectedValue(new Error('Redis Down'));
      (db.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('task-1');

      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Redis GET error'), expect.any(Error));
      expect(db.task.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should log error if async setex fails', async () => {
      mockRedisGet.mockResolvedValue(null);
      (db.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
      mockRedisSetex.mockRejectedValue(new Error('Setex Failed'));

      const result = await taskService.getTaskById('task-1');
      expect(result).toEqual(mockTask);

      // Wait for async setex to complete
      await new Promise(process.nextTick);
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Redis SETEX error'), expect.any(Error));
    });

    it('should throw 404 if task not found in DB', async () => {
      mockRedisGet.mockResolvedValue(null);
      (db.task.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTaskById('non-existent')).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskInput = { title: 'New Task', project_id: 'project-1' };
      (db.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
      (db.task.create as jest.Mock).mockResolvedValue({ ...mockTask, title: 'New Task' });

      const result = await taskService.createTask(taskInput, 'user-1');

      expect(db.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'New Task' }),
      });
      expect(result.title).toBe('New Task');
    });

    it('should handle P2003 (foreign key constraint) error', async () => {
      (db.project.findUnique as jest.Mock).mockResolvedValue(mockProject);
      const error = new Error('Foreign key violation');
      (error as any).code = 'P2003';
      (db.task.create as jest.Mock).mockRejectedValue(error);

      await expect(taskService.createTask({ title: 'T', project_id: 'bad' }, 'user-1'))
        .rejects.toThrow('Invalid project_id or assignee_id');
    });

    it('should throw 403 if user does not own project', async () => {
      (db.project.findUnique as jest.Mock).mockResolvedValue({ ...mockProject, owner_id: 'other' });

      await expect(taskService.createTask({ title: 'T', project_id: 'p1' }, 'user-1'))
        .rejects.toThrow('Access denied: You do not own this project');
    });
  });

  describe('updateTask', () => {
    let mockRedisDel: jest.Mock;

    beforeEach(() => {
      mockRedisDel = jest.fn().mockResolvedValue(1);
      (redisService.getClient as jest.Mock).mockReturnValue({
        del: mockRedisDel,
      });
    });

    it('should update a task successfully', async () => {
      const updateData = { title: 'Updated' };
      (db.task.update as jest.Mock).mockResolvedValue({ ...mockTask, title: 'Updated' });

      const result = await taskService.updateTask('task-1', updateData);

      expect(db.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        data: updateData,
      });
      expect(mockRedisDel).toHaveBeenCalledWith('task:task-1');
      expect(result.title).toBe('Updated');
    });

    it('should log warning if cache invalidation fails during update', async () => {
      const updateData = { title: 'Updated' };
      (db.task.update as jest.Mock).mockResolvedValue({ ...mockTask, title: 'Updated' });
      mockRedisDel.mockRejectedValue(new Error('Redis error'));

      const result = await taskService.updateTask('task-1', updateData);

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache Invalidation failed for key task:task-1'),
        expect.any(Error)
      );
      expect(result.title).toBe('Updated');
    });

    it('should handle P2025 (not found) on update', async () => {
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      (db.task.update as jest.Mock).mockRejectedValue(error);

      await expect(taskService.updateTask('none', { title: 'T' })).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    let mockRedisDel: jest.Mock;

    beforeEach(() => {
      mockRedisDel = jest.fn().mockResolvedValue(1);
      (redisService.getClient as jest.Mock).mockReturnValue({
        del: mockRedisDel,
      });
    });

    it('should delete a task successfully', async () => {
      (db.task.delete as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.deleteTask('task-1');

      expect(db.task.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } });
      expect(mockRedisDel).toHaveBeenCalledWith('task:task-1');
      expect(result.success).toBe(true);
    });

    it('should log warning if cache invalidation fails during delete', async () => {
      (db.task.delete as jest.Mock).mockResolvedValue(mockTask);
      mockRedisDel.mockRejectedValue(new Error('Redis error'));

      const result = await taskService.deleteTask('task-1');

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Cache Invalidation failed for key task:task-1'),
        expect.any(Error)
      );
      expect(result.success).toBe(true);
    });

    it('should handle P2025 (not found) on delete', async () => {
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      (db.task.delete as jest.Mock).mockRejectedValue(error);

      await expect(taskService.deleteTask('none')).rejects.toThrow('Task not found');
    });
  });
});

