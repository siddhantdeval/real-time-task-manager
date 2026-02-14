import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { asyncHandler } from '../utils/asyncHandler';
import { Status, Priority } from '@prisma/client';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { project_id, assignee_id, status } = req.query;

  const where: any = {};
  if (project_id) where.project_id = String(project_id);
  if (assignee_id) where.assignee_id = String(assignee_id);
  if (status) where.status = status as Status;

  const tasks = await db.task.findMany({
    where,
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, email: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  res.json({ success: true, data: tasks });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await db.task.findUnique({
    where: { id: String(id) },
    include: {
      project: true,
      assignee: { select: { id: true, email: true } },
    },
  });

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  res.json({ success: true, data: task });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;

  try {
    const task = await db.task.create({
      data: {
        title,
        description,
        status: status as Status,
        priority: priority as Priority,
        due_date: due_date ? new Date(due_date) : null,
        project_id,
        assignee_id,
      },
    });
    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'Invalid project_id or assignee_id' });
    }
    throw error;
  }
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;

  try {
    const task = await db.task.update({
      where: { id: String(id) },
      data: {
        title,
        description,
        status: status as Status,
        priority: priority as Priority,
        due_date: due_date ? new Date(due_date) : undefined, // Explicit undefined to skip if not provided
        // project_id, // Usually tasks don't move projects, but can enable if needed. Schema allows.
        assignee_id,
      },
    });
    res.json({ success: true, data: task });
  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json({ success: false, message: 'Task not found' });
    }
    throw error;
  }
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.task.delete({ where: { id: String(id) } });
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return res.status(404).json({ success: false, message: 'Task not found' });
    }
    throw error;
  }
});
