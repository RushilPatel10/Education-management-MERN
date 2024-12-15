const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');

// Create assignment
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, totalPoints, courseId } = req.body;
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      totalPoints,
      course: courseId,
      createdBy: req.user._id
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('submissions')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = new Submission({
      assignment: assignment._id,
      student: req.user._id,
      content: req.body.content,
      attachments: req.body.attachments
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade submission
router.post('/:assignmentId/submissions/:submissionId/grade', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const course = await Course.findById(assignment.course);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to grade' });
    }

    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;
    submission.gradedAt = Date.now();
    submission.gradedBy = req.user._id;

    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new route for teacher assignments
router.get('/teacher', auth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(course => course._id);
    
    const assignments = await Assignment.find({
      course: { $in: courseIds }
    })
    .populate('course', 'name')
    .sort({ dueDate: 1 });
    
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 