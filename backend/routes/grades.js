const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Grade = require('../models/Grade');
const Course = require('../models/Course');

// Get grades for student
router.get('/student', auth, async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.user._id
    })
    .populate('assignment', 'title totalPoints')
    .populate('course', 'name')
    .sort({ createdAt: -1 });

    res.json(grades);
  } catch (error) {
    console.error('Error fetching student grades:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get grades for teacher's courses
router.get('/teacher', auth, async (req, res) => {
  try {
    const grades = await Grade.find({
      'course': { $in: await Course.find({ instructor: req.user._id }).select('_id') }
    })
    .populate('student', 'name')
    .populate('assignment', 'title totalPoints')
    .populate('course', 'name')
    .sort({ createdAt: -1 });

    res.json(grades);
  } catch (error) {
    console.error('Error fetching teacher grades:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 