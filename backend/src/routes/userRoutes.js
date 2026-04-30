const router = require('express').Router();
const { listUsers } = require('../controllers/userController');
const { auth, requireGlobalAdmin } = require('../middleware/auth');

router.get('/', auth, requireGlobalAdmin, listUsers);

module.exports = router;
