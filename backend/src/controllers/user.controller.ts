import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { asyncHandler } from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      created_at: true,
    },
  });
  res.json({ success: true, data: users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await db.user.findUnique({
    where: { id: String(id) },
    select: {
      id: true,
      email: true,
      role: true,
      created_at: true,
      owned_projects: true,
      assigned_tasks: true,
    },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  
  // In a real app, hash password here using bcrypt
  const password_hash = password; // simplistic for now as per instructions

  try {
    const user = await db.user.create({
      data: {
        email,
        password_hash,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    throw error;
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, role } = req.body;

  const data: any = {};
  if (email) data.email = email;
  if (password) data.password_hash = password; // Should hash
  if (role) data.role = role;

  const user = await db.user.update({
    where: { id: String(id) },
    data,
    select: {
      id: true,
      email: true,
      role: true,
      // updated_at: false, // User model follows schema
    }
  });

  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.user.delete({ where: { id: String(id) } });
  res.json({ success: true, message: 'User deleted successfully' });
});
