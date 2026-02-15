import { taskService } from './task.service';
import { db } from './db.service';

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

describe('TaskService Unit Tests', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Description',
    status: 'todo',
    priority: 'medium',
    project_id: 'project-1',
    created_at: new Date(),
    updated_at: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTaskById', () => {
    it('should return a task if found', async () => {
      (db.task.findUnique as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('task-1');

      expect(db.task.findUnique).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it('should throw 404 if task not found', async () => {
      (db.task.findUnique as jest.Mock).mockResolvedValue(null);

      try {
        await taskService.getTaskById('non-existent');
      } catch (error: any) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Task not found');
      }
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskInput = {
        title: 'New Task',
        project_id: 'project-1',
      };
      
      (db.project.findUnique as jest.Mock).mockResolvedValue({ id: 'project-1', owner_id: 'user-1' });
      (db.task.create as jest.Mock).mockResolvedValue({ ...mockTask, title: 'New Task' });

      const result = await taskService.createTask(taskInput, 'user-1');

      expect(db.task.create).toHaveBeenCalled();
      expect(result.title).toBe('New Task');
    });

    it('should throw 403 if user does not own project', async () => {
      const taskInput = {
        title: 'New Task',
        project_id: 'project-1',
      };
      
      (db.project.findUnique as jest.Mock).mockResolvedValue({ id: 'project-1', owner_id: 'other-user' });

      try {
        await taskService.createTask(taskInput, 'user-1');
      } catch (error: any) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe('Access denied: You do not own this project');
      }
    });
  });
});
