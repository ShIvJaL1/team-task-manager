const router = require('express').Router();
const { listUsers } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Any authenticated user can list users (needed for task assignment dropdown)
router.get('/', auth, listUsers);

module.exports = router;
