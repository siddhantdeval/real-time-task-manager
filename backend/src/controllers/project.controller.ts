import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await db.project.findMany({
    include: {
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });
  res.json({ success: true, data: projects });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await db.project.findUnique({
    where: { id: String(id) },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
        },
      },
      tasks: true,
    },
  });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  res.json({ success: true, data: project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, owner_id } = req.body;

  try {
    const project = await db.project.create({
      data: {
        name,
        description,
        owner_id,
      },
    });
    res.status(201).json({ success: true, data: project });
  } catch (error: any) {
    if (error.code === 'P2003') { // Foreign key constraint failed
      return res.status(400).json({ success: false, message: 'Invalid owner_id' });
    }
    throw error;
  }
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const project = await db.project.update({
    where: { id: String(id) },
    data: {
      name,
      description,
    },
  });

  res.json({ success: true, data: project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.project.delete({ where: { id: String(id) } });
  res.json({ success: true, message: 'Project deleted successfully' });
});

export const getProjectsByUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const projects = await db.project.findMany({
    where: { owner_id: String(userId) },
  });
  res.json({ success: true, data: projects });
});
