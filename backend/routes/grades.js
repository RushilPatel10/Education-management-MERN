const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

// Middleware for authentication
const auth = require('../middleware/auth');

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
  next();
};

// Get grades for a student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      'submissions.student': req.params.studentId,
      'submissions.grade': { $exists: true }
    })
    .populate('course', 'name')
    .select('title submissions.$');

    const grades = assignments.map(assignment => ({
      assignmentId: assignment._id,
      title: assignment.title,
      course: assignment.course,
      grade: assignment.submissions[0].grade
    }));

    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit grade for an assignment
router.post('/:assignmentId/submissions/:submissionId', auth, isTeacher, async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { score, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = {
      score,
      feedback,
      gradedBy: req.user.id,
      gradedAt: Date.now()
    };

    await assignment.save();

    // Create notification for student
    await Notification.create({
      user: submission.student,
      title: 'Assignment Graded',
      message: `Your submission for ${assignment.title} has been graded`,
      type: 'grade',
      reference: assignment._id
    });

    res.json({ message: 'Grade submitted successfully', submission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all grades for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
      'submissions.grade': { $exists: true }
    })
    .populate('submissions.student', 'name email')
    .select('title submissions');

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a grade
router.put('/:assignmentId/submissions/:submissionId', auth, isTeacher, async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { score, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = {
      ...submission.grade,
      score,
      feedback,
      gradedBy: req.user.id,
      gradedAt: Date.now()
    };

    await assignment.save();

    // Create notification for grade update
    await Notification.create({
      user: submission.student,
      title: 'Grade Updated',
      message: `Your grade for ${assignment.title} has been updated`,
      type: 'grade',
      reference: assignment._id
    });

    res.json({ message: 'Grade updated successfully', submission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 