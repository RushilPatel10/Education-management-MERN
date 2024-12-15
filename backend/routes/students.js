const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Get enrolled courses
router.get('/courses', auth, async (req, res) => {
  try {
    console.log('Fetching courses for student:', req.user._id); // Debug log
    const courses = await Course.find({ students: req.user._id })
      .populate('instructor', 'name email')
      .select('-students');
    
    console.log('Found courses:', courses); // Debug log
    res.json(courses);
  } catch (error) {
    console.error('Error in /courses:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
});

// Get student's assignments
router.get('/assignments', auth, async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ students: req.user._id });
    const courseIds = enrolledCourses.map(course => course._id);
    
    const assignments = await Assignment.find({
      course: { $in: courseIds }
    }).populate('course', 'name');

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student stats
router.get('/stats', auth, async (req, res) => {
  try {
    console.log('Fetching stats for student:', req.user._id);
    const enrolledCourses = await Course.find({ students: req.user._id });
    const courseIds = enrolledCourses.map(course => course._id);
    
    const assignments = await Assignment.find({
      course: { $in: courseIds }
    });

    const submissions = await Submission.find({
      student: req.user._id
    });

    const stats = {
      totalCourses: enrolledCourses.length,
      totalAssignments: assignments.length,
      completedAssignments: submissions.length,
      pendingAssignments: assignments.length - submissions.length
    };

    console.log('Stats calculated:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
router.post('/assignments/:id/submit', auth, async (req, res) => {
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
    console.error('Error in assignment submission:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get student submissions
router.get('/submissions', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 