const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

router.post('/', 
  [auth, authorize('admin')], 
  courseController.createCourse
);

router.get('/', 
  auth, 
  courseController.getCourses
);

router.put('/:id', 
  [auth, authorize('admin', 'teacher')], 
  courseController.updateCourse
);

router.delete('/:id', 
  [auth, authorize('admin')], 
  courseController.deleteCourse
);

router.post('/:id/enroll', 
  [auth, authorize('admin')], 
  courseController.enrollStudent
);

module.exports = router; 