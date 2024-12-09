const router = require('express').Router();
const { auth } = require('../middleware/auth');
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getProfile);

module.exports = router; 