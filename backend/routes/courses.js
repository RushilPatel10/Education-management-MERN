const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');

// Get all courses (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get enrolled courses for student
router.get('/enrolled', auth, async (req, res) => {
  try {
    const courses = await Course.find({
      students: req.user._id
    }).populate('instructor', 'name');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get courses for teacher
router.get('/teaching', auth, async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id
    })
    .populate('students', 'name email')
    .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 