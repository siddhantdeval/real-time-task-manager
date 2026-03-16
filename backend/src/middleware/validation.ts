import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { getProjectTasksSchema } from '../dto/project.dto';

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

export const validateGetProjectTasks = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = getProjectTasksSchema.validate({
    projectId: req.params.id,
    page: req.query.page,
    limit: req.query.limit,
  });

  if (error) {
    const errors = error.details.map((detail: Joi.ValidationErrorItem) => detail.message);
    return res.status(400).json({ success: false, errors });
  }

  // Pass validated values via res.locals to avoid issues with req.query/req.params modifications
  res.locals.pagination = {
    projectId: value.projectId,
    page: value.page,
    limit: value.limit,
  };
  
  next();
};

export { 
  createUserSchema, 
  updateUserSchema 
} from '../dto/user.dto';

export { 
  createProjectSchema, 
  updateProjectSchema,
  getProjectTasksSchema
} from '../dto/project.dto';

export { 
  registerSchema, 
  loginSchema, 
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../dto/auth.dto';

export { 
  createTaskSchema, 
  updateTaskSchema 
} from '../dto/task.dto';


