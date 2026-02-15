import { db } from './db.service';
import { hashPassword } from '../utils/password';
import { Role } from '../generated/prisma';

class UserService {
  async getAllUsers() {
    return db.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  }

  async getUserById(id: string) {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        owned_projects: true,
        assigned_tasks: {
            include: {
                project: { select: { name: true } }
            }
        },
      },
    });

    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }
    return user;
  }

  async createUser(data: { email: string; password?: string; role?: Role; google_id?: string; avatar_url?: string }) {
    const { password, ...userData } = data;
    
    let password_hash = null;
    if (password) {
        password_hash = await hashPassword(password);
    }

    try {
      return await db.user.create({
        data: {
          ...userData,
          password_hash,
        },
        select: {
          id: true,
          email: true,
          role: true,
          created_at: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        const err = new Error('Email already exists');
        (err as any).statusCode = 409;
        throw err;
      }
      throw error;
    }
  }

  async updateUser(id: string, data: { email?: string; password?: string; role?: Role }) {
    const updateData: any = { ...data };
    
    if (data.password) {
        updateData.password_hash = await hashPassword(data.password);
        delete updateData.password;
    }

    try {
      return await db.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('User not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await db.user.delete({ where: { id } });
      return { success: true, message: 'User deleted successfully' };
    } catch (error: any) {
      if (error.code === 'P2025') {
        const err = new Error('User not found');
        (err as any).statusCode = 404;
        throw err;
      }
      throw error;
    }
  }
}

export const userService = new UserService();
