import { Router } from 'express';
import {
  getProjects,
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  archiveProject,
  deleteProject,
  getProjectsByUser,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  updateMemberRole,
  getProjectActivity,
  getProjectProgress,
} from '../controllers/project.controller';
import {
  validate,
  createProjectSchema,
  updateProjectSchema,
} from '../middleware/validation';
import { authenticate } from '../middleware/auth.middleware';
import { inviteMemberSchema, updateMemberRoleSchema } from '../dto/project.dto';

const router = Router();

router.use(authenticate);

// Core project routes
router.get('/me', getMyProjects);              // ← must be before /:id
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validate(createProjectSchema), createProject);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.patch('/:id/archive', archiveProject);
router.delete('/:id', deleteProject);

// Legacy
router.get('/user/:userId', getProjectsByUser);

// Member management
router.get('/:id/members', getProjectMembers);
router.post('/:id/members', validate(inviteMemberSchema), addProjectMember);
router.patch('/:id/members/:memberId', validate(updateMemberRoleSchema), updateMemberRole);
router.delete('/:id/members/:memberId', removeProjectMember);

// Activity & progress
router.get('/:id/activity', getProjectActivity);
router.get('/:id/progress', getProjectProgress);

export default router;
