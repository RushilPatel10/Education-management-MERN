const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/assignments/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all assignments for a course
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('course', 'name')
      .sort('-createdAt');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new assignment
router.post('/', auth, upload.array('files'), async (req, res) => {
  try {
    // Verify user is teacher of the course
    const course = await Course.findById(req.body.courseId);
    if (!course || course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const assignment = new Assignment({
      title: req.body.title,
      description: req.body.description,
      course: req.body.courseId,
      dueDate: req.body.dueDate,
      totalPoints: req.body.totalPoints,
      attachments: req.files?.map(file => ({
        filename: file.originalname,
        path: file.path,
        uploadDate: Date.now()
      })) || []
    });

    const savedAssignment = await assignment.save();
    await savedAssignment.populate('course', 'name');
    
    res.status(201).json(savedAssignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Submit assignment
router.post('/:id/submit', auth, upload.array('files'), async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(assignment.course);
    if (!course.students.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      sub => sub.student.toString() === req.user.id
    );
    if (existingSubmission) {
      return res.status(400).json({ message: 'Already submitted' });
    }

    assignment.submissions.push({
      student: req.user.id,
      submissionDate: Date.now(),
      files: req.files?.map(file => ({
        filename: file.originalname,
        path: file.path
      })) || []
    });

    await assignment.save();
    res.json({ message: 'Assignment submitted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Grade assignment submission
router.post('/:id/grade/:studentId', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify user is teacher of the course
    const course = await Course.findById(assignment.course);
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to grade' });
    }

    const submission = assignment.submissions.find(
      sub => sub.student.toString() === req.params.studentId
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = {
      score: req.body.score,
      feedback: req.body.feedback,
      gradedBy: req.user.id,
      gradedAt: Date.now()
    };

    await assignment.save();
    res.json({ message: 'Assignment graded successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 