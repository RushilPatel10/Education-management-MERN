const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const courseController = require('../controllers/course.controller');

router.use(auth);

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);
router.post('/', authorize('admin'), courseController.createCourse);
router.put('/:id', authorize('admin'), courseController.updateCourse);
router.delete('/:id', authorize('admin'), courseController.deleteCourse);

module.exports = router; 