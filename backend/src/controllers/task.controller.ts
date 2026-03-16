import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import { Status } from '../generated/prisma';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { project_id, assignee_id, status } = req.query;

  const filter: any = {};
  if (project_id) filter.project_id = String(project_id);
  if (assignee_id) filter.assignee_id = String(assignee_id);
  if (status) filter.status = status as Status;

  const tasks = await taskService.getAllTasks(filter);
  res.json({ success: true, data: tasks });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await taskService.getTaskById(id as string);
  res.json({ success: true, data: task });
});

export const getTasksByProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, page, limit } = res.locals.pagination;

  const skip = (page - 1) * limit;
  const take = limit;

  const tasksPromise = taskService.getTasksByProject(projectId, skip, take);
  const totalTasksPromise = taskService.countTasksByProject(projectId);

  const [tasks, totalTasks] = await Promise.all([tasksPromise, totalTasksPromise]);

  res.json({
    success: true,
    data: tasks,
    meta: {
      page,
      limit,
      total: totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    },
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body, req.user?.id);
  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await taskService.updateTask(id as string, req.body);
  res.json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await taskService.deleteTask(id as string);
  res.json(result);
});
