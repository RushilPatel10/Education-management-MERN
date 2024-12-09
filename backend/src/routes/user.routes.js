const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.use(auth);

router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', authorize('admin'), userController.updateUser);
router.delete('/:id', authorize('admin'), userController.deleteUser);
router.post('/:id/enroll', authorize('admin', 'student'), userController.enrollInCourse);
router.post('/:id/unenroll', authorize('admin', 'student'), userController.unenrollFromCourse);

module.exports = router; 