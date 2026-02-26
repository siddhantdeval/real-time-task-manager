import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.min': 'Project name must be at least 3 characters long',
    'any.required': 'Project name is required',
  }),
  description: Joi.string().allow('', null),
  labelColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#6366f1'),
  // owner_id is now taken from the authenticated session, never from the body
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().allow('', null),
  labelColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
  status: Joi.string().valid('ACTIVE', 'PLANNING', 'DRAFT', 'BLOCKED'),
}).min(1);

export const inviteMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('LEAD', 'MEMBER', 'VIEWER').default('MEMBER'),
});

export const updateMemberRoleSchema = Joi.object({
  role: Joi.string().valid('LEAD', 'MEMBER', 'VIEWER').required(),
});
