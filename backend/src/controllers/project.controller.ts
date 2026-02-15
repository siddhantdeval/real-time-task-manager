import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects();
  res.json({ success: true, data: projects });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await projectService.getProjectById(id as string);
  res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await projectService.updateProject(id as string, req.body, req.user?.id);
  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await projectService.deleteProject(id as string, req.user?.id);
  res.json(result);
});

export const getProjectsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const projects = await projectService.getProjectsByUser(userId as string);
  res.json({ success: true, data: projects });
});

