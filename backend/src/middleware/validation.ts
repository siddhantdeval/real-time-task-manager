import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
};

// User Schemas
export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'member').default('member'),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('admin', 'member'),
});

// Project Schemas
export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  owner_id: Joi.string().uuid().required(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
});

// Task Schemas
export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  due_date: Joi.date().iso().allow(null),
  project_id: Joi.string().uuid().required(),
  assignee_id: Joi.string().uuid().allow(null),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  due_date: Joi.date().iso().allow(null),
  project_id: Joi.string().uuid(),
  assignee_id: Joi.string().uuid().allow(null),
});
