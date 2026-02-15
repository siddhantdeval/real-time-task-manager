import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUser,
} from '../controllers/project.controller';
import { validate, createProjectSchema, updateProjectSchema } from '../middleware/validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validate(createProjectSchema), createProject);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);
router.get('/user/:userId', getProjectsByUser);

export default router;

