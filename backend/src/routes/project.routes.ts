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
import { getTasksByProject } from '../controllers/task.controller';
import {
  validate,
  createProjectSchema,
  updateProjectSchema,
  getProjectTasksSchema,
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

// Tasks within project
// Use a generic request validator middleware here since validate() targets req.body.
// To validate req.params/query we might need a custom approach or adapt validate()
// Wait, looking at validate definition it validates req.body. I will need to validate query/params natively in controller or modify the middleware.
// Let's use validation inside controller or just rely on controller parsing since validate only checks req.body
router.get('/:id/tasks', getTasksByProject);

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
