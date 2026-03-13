import { db } from './db.service';
import { Status, Priority } from '../generated/prisma';
import { redisService } from './redis.service';
import { logger } from '../utils/logger';
import { config } from '../config';

export interface TaskFilter {
  project_id?: string;
  assignee_id?: string;
  status?: Status;
}
class TaskService {
  async getAllTasks(filter: TaskFilter) {
    return db.task.findMany({
      where: filter,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getTasksByProject(projectId: string, skip: number, take: number) {
    return db.task.findMany({
      where: { project_id: projectId },
      skip,
      take,
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async countTasksByProject(projectId: string): Promise<number> {
    return db.task.count({
      where: { project_id: projectId },
    });
  }

  async getTaskById(id: string) {
    const cacheKey = `task:${id}`;

    try {
      const client = redisService.getClient();
      const cachedTask = await client.get(cacheKey);
      if (cachedTask) {
        try {
          const parsed = JSON.parse(cachedTask);
          return parsed;
        } catch (parseError) {
          logger.warn(`Malformed JSON in cache for key ${cacheKey}`);
        }
      }
    } catch (redisError) {
      logger.error(`Redis GET error for key ${cacheKey}:`, redisError);
    }

    const task = await db.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: { select: { id: true, email: true } },
      },
    });

    if (!task) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Set Redis Cache Asynchronously
    (async () => {
      try {
        const client = redisService.getClient();
        const ttl = config.redis.taskTTL ? parseInt(config.redis.taskTTL, 10) : 300;
        await client.setex(cacheKey, ttl, JSON.stringify(task));
      } catch (redisError) {
        logger.error(`Redis SETEX error for key ${cacheKey}:`, redisError);
      }
    })();

    return task;
  }

  async createTask(
    data: {
      title: string;
      description?: string | null;
      status?: Status;
      priority?: Priority;
      due_date?: string | Date | null;
      project_id: string;
      assignee_id?: string | null;
    },
    userId?: string,
  ) {
    // If userId is provided, verify project ownership
    if (userId) {
      const project = await db.project.findUnique({ where: { id: data.project_id } });
      if (!project || project.owner_id !== userId) {
        const error = new Error('Access denied: You do not own this project');
        (error as any).statusCode = 403;
        throw error;
      }
    }

    const taskData = {
      ...data,
      due_date: data.due_date ? new Date(data.due_date) : null,
      status: data.status as Status,
      priority: data.priority as Priority,
    };

    try {
      return await db.task.create({
        data: taskData,
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        const err = new Error('Invalid project_id or assignee_id');
        (err as any).statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  async updateTask(id: string, data: any) {
    const updateData = { ...data };
    if (data.due_date !== undefined) {
      updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    }

    try {
      const updatedTask = await db.task.update({
        where: { id },
        data: updateData,
      });

      // Cache invalidation
      try {
        const client = redisService.getClient();
        await client.del(`task:${id}`);
      } catch (redisError) {
        logger.warn(`Cache Invalidation failed for key task:${id}:`, redisError);
      }

      return updatedTask;
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('Task not found');
        (err as any).statusCode = 404;
        throw err;
      }
      if (error.code === 'P2003') {
        const err = new Error('Invalid project_id or assignee_id');
        (err as any).statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      await db.task.delete({
        where: { id },
      });

      // Cache invalidation
      try {
        const client = redisService.getClient();
        await client.del(`task:${id}`);
      } catch (redisError) {
        logger.warn(`Cache Invalidation failed for key task:${id}:`, redisError);
      }

      return { success: true, message: 'Task deleted successfully' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('Task not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }
}

export const taskService = new TaskService();
