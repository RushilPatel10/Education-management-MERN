const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Middleware to verify teacher role
const verifyTeacher = (req, res, next) => {
  console.log('Verifying teacher role:', req.user);
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
  next();
};

// Apply auth and role check to all routes
router.use(auth);
router.use(verifyTeacher);

router.get('/courses', async (req, res) => {
  try {
    console.log('Fetching courses for teacher:', req.user._id);
    const courses = await Course.find({ instructor: req.user._id })
      .populate('students', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Found courses:', courses.length);
    res.json(courses);
  } catch (error) {
    console.error('Error in teacher courses:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/assignments', async (req, res) => {
  try {
    console.log('Fetching assignments for teacher:', req.user.id);
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map(course => course._id);
    
    const assignments = await Assignment.find({
      course: { $in: courseIds }
    }).populate('course');
    
    res.json(assignments);
  } catch (error) {
    console.error('Error in teacher assignments:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map(course => course._id);
    
    const stats = {
      totalCourses: courses.length,
      totalStudents: courses.reduce((acc, course) => acc + (course.students?.length || 0), 0),
      totalAssignments: await Assignment.countDocuments({ course: { $in: courseIds } }),
      totalSubmissions: await Submission.countDocuments({ 
        course: { $in: courseIds }
      })
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in teacher stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 