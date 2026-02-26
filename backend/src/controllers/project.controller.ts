import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects();
  res.json({ success: true, data: projects });
});

export const getMyProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getMyProjects(req.user!.id);
  res.json({ success: true, data: projects });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getProjectById(req.params.id as string);
  res.json({ success: true, data: project });
});

// SECURITY FIX: owner_id always from session, never from body
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.createProject({
    ...req.body,
    owner_id: req.user!.id,
  });
  res.status(201).json({ success: true, data: project });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(req.params.id as string, req.body, req.user?.id);
  res.json({ success: true, data: project });
});

export const archiveProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.archiveProject(req.params.id as string, req.user!.id);
  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const result = await projectService.deleteProject(req.params.id as string, req.user?.id);
  res.json(result);
});

// ── Members ───────────────────────────────────────────────────────────────

export const getProjectMembers = asyncHandler(async (req: Request, res: Response) => {
  const members = await projectService.getProjectMembers(req.params.id as string);
  res.json({ success: true, data: members });
});

export const addProjectMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await projectService.addProjectMember(req.params.id as string, req.body, req.user!.id);
  res.status(201).json({ success: true, data: member });
});

export const removeProjectMember = asyncHandler(async (req: Request, res: Response) => {
  await projectService.removeProjectMember(req.params.id as string, req.params.memberId as string, req.user!.id);
  res.json({ success: true });
});

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const member = await projectService.updateMemberRole(
    req.params.id as string,
    req.params.memberId as string,
    req.body.role,
    req.user!.id,
  );
  res.json({ success: true, data: member });
});

// ── Activity & Progress ───────────────────────────────────────────────────

export const getProjectActivity = asyncHandler(async (req: Request, res: Response) => {
  const activity = await projectService.getRecentActivity(req.params.id as string);
  res.json({ success: true, data: activity });
});

export const getProjectProgress = asyncHandler(async (req: Request, res: Response) => {
  const progress = await projectService.computeProgress(req.params.id as string);
  res.json({ success: true, data: progress });
});

export const getProjectsByUser = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getProjectsByUser(req.params.userId as string);
  res.json({ success: true, data: projects });
});
