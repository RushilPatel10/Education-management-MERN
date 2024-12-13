const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const assignmentController = require('../controllers/assignmentController');

router.post('/courses/:courseId/assignments',
  [auth, authorize('teacher', 'admin')],
  assignmentController.createAssignment
);

router.get('/courses/:courseId/assignments',
  auth,
  assignmentController.getAssignments
);

router.post('/assignments/:id/submit',
  [auth, authorize('student')],
  assignmentController.submitAssignment
);

router.post('/assignments/:id/submissions/:submissionId/grade',
  [auth, authorize('teacher', 'admin')],
  assignmentController.gradeAssignment
);

module.exports = router; 