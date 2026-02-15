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

export { 
  createUserSchema, 
  updateUserSchema 
} from '../dto/user.dto';

export { 
  createProjectSchema, 
  updateProjectSchema 
} from '../dto/project.dto';

export { 
  registerSchema, 
  loginSchema, 
  googleLoginSchema 
} from '../dto/auth.dto';

export { 
  createTaskSchema, 
  updateTaskSchema 
} from '../dto/task.dto';


