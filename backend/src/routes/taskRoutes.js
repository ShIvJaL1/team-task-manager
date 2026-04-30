const router = require('express').Router();
const { auth, requireGlobalAdmin } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateStatus,
  deleteTask,
  dashboard
} = require('../controllers/taskController');

router.get('/dashboard', auth, dashboard);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTask);
router.post('/', auth, requireGlobalAdmin, createTask);
router.put('/:id', auth, requireGlobalAdmin, updateTask);
router.patch('/:id/status', auth, updateStatus);
router.delete('/:id', auth, requireGlobalAdmin, deleteTask);

module.exports = router;
