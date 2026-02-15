import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().allow('', null),
  owner_id: Joi.string().uuid().required().messages({
    'string.uuid': 'Invalid owner UUID format',
    'any.required': 'Owner ID is required',
  }),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().allow('', null),
}).min(1);
