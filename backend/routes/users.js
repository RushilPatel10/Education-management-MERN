const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// All routes should be protected and only accessible by admin
router.use(auth, authorize('admin'));

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router; 