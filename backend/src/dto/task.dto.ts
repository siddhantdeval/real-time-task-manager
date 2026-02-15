import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required().messages({
    'string.min': 'Title must be at least 3 characters long',
    'any.required': 'Title is required',
  }),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  due_date: Joi.date().iso().allow(null),
  project_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid project UUID format',
    'any.required': 'Project ID is required',
  }),
  assignee_id: Joi.string().uuid().allow(null).messages({
    'string.uuid': 'Invalid assignee UUID format',
  }),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  due_date: Joi.date().iso().allow(null),
  project_id: Joi.string().uuid(),
  assignee_id: Joi.string().uuid().allow(null),
}).min(1); // At least one field must be provided for update
