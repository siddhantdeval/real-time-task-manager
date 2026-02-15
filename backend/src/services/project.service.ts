import { db } from './db.service';

class ProjectService {
  async getAllProjects() {
    return db.project.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getProjectById(id: string) {
    const project = await db.project.findUnique({
      where: { id },
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
      const error = new Error('Project not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return project;
  }

  async createProject(data: { name: string; description?: string | null; owner_id: string }) {
    try {
      return await db.project.create({
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2003') {
        const err = new Error('Invalid owner_id');
        (err as any).statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  async updateProject(id: string, data: { name?: string; description?: string | null }, userId?: string) {
    // Security check: Only owner can update (basic implementation)
    if (userId) {
      const existing = await db.project.findUnique({ where: { id } });
      if (existing && existing.owner_id !== userId) {
        const error = new Error('Access denied: You do not own this project');
        (error as any).statusCode = 403;
        throw error;
      }
    }

    try {
      return await db.project.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('Project not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  async deleteProject(id: string, userId?: string) {
    if (userId) {
      const existing = await db.project.findUnique({ where: { id } });
      if (existing && existing.owner_id !== userId) {
        const error = new Error('Access denied: You do not own this project');
        (error as any).statusCode = 403;
        throw error;
      }
    }

    try {
      await db.project.delete({ where: { id } });
      return { success: true, message: 'Project deleted successfully' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('Project not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  async getProjectsByUser(userId: string) {
    return db.project.findMany({
      where: { owner_id: userId },
    });
  }
}

export const projectService = new ProjectService();
