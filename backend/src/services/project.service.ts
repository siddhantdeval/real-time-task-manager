import { db } from './db.service';
import { MemberRole, ProjectStatus } from '../generated/prisma';
import { logActivity } from '../utils/logActivity';

class ProjectService {
  async getAllProjects() {
    return db.project.findMany({
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: { include: { user: { select: { id: true, email: true, name: true, avatar_url: true } } } },
        _count: { select: { tasks: true } },
      },
    });
  }

  // GET /projects/me — only the logged-in user's projects (excluding archived)
  async getMyProjects(userId: string) {
    return db.project.findMany({
      where: {
        owner_id: userId,
        status: { not: ProjectStatus.ARCHIVED },
      },
      include: {
        members: { include: { user: { select: { id: true, email: true, name: true, avatar_url: true } } } },
        _count: { select: { tasks: true } },
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  async getProjectById(id: string) {
    const [project, taskStats] = await Promise.all([
      db.project.findUnique({
        where: { id },
        include: {
          owner: { select: { id: true, email: true, name: true } },
          tasks: true,
          members: { include: { user: { select: { id: true, email: true, name: true, avatar_url: true } } } },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { actor: { select: { id: true, name: true, email: true } } },
          },
        },
      }),
      db.task.groupBy({
        by: ['status'],
        where: { project_id: id },
        _count: { status: true },
      }),
    ]);

    if (!project) {
      const error = new Error('Project not found');
      (error as any).statusCode = 404;
      throw error;
    }

    const total = taskStats.reduce((s, g) => s + g._count.status, 0);
    const done = taskStats.find(g => g.status === 'done')?._count.status ?? 0;
    return {
      ...project,
      progress: { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 },
    };
  }

  async createProject(data: { name: string; description?: string | null; labelColor?: string; owner_id: string }) {
    try {
      return await db.$transaction(async (tx) => {
        const project = await tx.project.create({ data });
        await tx.projectMember.create({
          data: {
            projectId: project.id,
            userId: data.owner_id,
            role: MemberRole.LEAD,
          },
        });
        await logActivity(project.id, data.owner_id, 'created the project', null, tx as any);
        return project;
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

  async updateProject(id: string, data: { name?: string; description?: string | null; labelColor?: string; status?: ProjectStatus }, userId?: string) {
    if (userId) {
      await this.assertOwnerOrLead(id, userId);
    }
    try {
      return await db.project.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('Project not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  async archiveProject(id: string, requesterId: string) {
    await this.assertOwnerOrLead(id, requesterId);
    const project = await db.project.update({
      where: { id },
      data: { status: ProjectStatus.ARCHIVED },
    });
    await logActivity(id, requesterId, 'archived this project');
    return project;
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

  // ── Member Management ──────────────────────────────────────────────────────

  async getProjectMembers(projectId: string) {
    return db.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, email: true, name: true, avatar_url: true } } },
    });
  }

  async addProjectMember(projectId: string, body: { email: string; role: string }, requesterId: string) {
    await this.assertOwnerOrLead(projectId, requesterId);
    const target = await db.user.findUnique({ where: { email: body.email } });
    if (!target) {
      const err = new Error('User not found');
      (err as any).statusCode = 404;
      throw err;
    }
    const member = await db.projectMember.create({
      data: { projectId, userId: target.id, role: body.role as MemberRole },
      include: { user: { select: { id: true, email: true, name: true, avatar_url: true } } },
    });
    await logActivity(projectId, requesterId, 'added a new member', target.email);
    return member;
  }

  async removeProjectMember(projectId: string, memberId: string, requesterId: string) {
    await this.assertOwnerOrLead(projectId, requesterId);
    await db.projectMember.delete({ where: { id: memberId } });
  }

  async updateMemberRole(projectId: string, memberId: string, role: string, requesterId: string) {
    await this.assertOwnerOrLead(projectId, requesterId);
    return db.projectMember.update({
      where: { id: memberId },
      data: { role: role as MemberRole },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  // ── Activity & Progress ───────────────────────────────────────────────────

  async getRecentActivity(projectId: string, limit = 10) {
    return db.projectActivity.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { actor: { select: { id: true, name: true, email: true } } },
    });
  }

  async computeProgress(projectId: string) {
    const [total, done] = await Promise.all([
      db.task.count({ where: { project_id: projectId } }),
      db.task.count({ where: { project_id: projectId, status: 'done' } }),
    ]);
    return { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  // Legacy: kept for backwards compatibility
  async getProjectsByUser(userId: string) {
    return this.getMyProjects(userId);
  }

  // ── Guards ────────────────────────────────────────────────────────────────

  private async assertOwnerOrLead(projectId: string, userId: string) {
    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) {
      const err = new Error('Project not found');
      (err as any).statusCode = 404;
      throw err;
    }
    if (project.owner_id === userId) return; // owners always allowed
    const membership = await db.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!membership || membership.role !== MemberRole.LEAD) {
      const err = new Error('Forbidden: only owners or leads can perform this action');
      (err as any).statusCode = 403;
      throw err;
    }
  }
}

export const projectService = new ProjectService();
