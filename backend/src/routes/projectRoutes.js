const router = require('express').Router();
const { auth, requireGlobalAdmin } = require('../middleware/auth');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.get('/:id', auth, getProject);
router.post('/', auth, requireGlobalAdmin, createProject);
router.put('/:id', auth, requireGlobalAdmin, updateProject);
router.delete('/:id', auth, requireGlobalAdmin, deleteProject);
router.post('/:id/members', auth, requireGlobalAdmin, addProjectMember);
router.delete('/:id/members/:userId', auth, requireGlobalAdmin, removeProjectMember);

module.exports = router;
