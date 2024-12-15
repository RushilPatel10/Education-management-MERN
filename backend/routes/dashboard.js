const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

router.get('/stats', auth, async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAssignments = await Assignment.countDocuments();
    
    // Calculate completion rate (example logic)
    const completedAssignments = await Assignment.countDocuments({ 'submissions.grade': { $exists: true } });
    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 0;

    res.json({
      totalCourses,
      totalStudents,
      totalAssignments,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/activities', auth, async (req, res) => {
  try {
    // Example activity data
    const activities = [
      {
        description: 'New course "Web Development" created',
        timestamp: new Date(),
        type: 'course'
      },
      {
        description: '5 new students enrolled in "Python Basics"',
        timestamp: new Date(Date.now() - 86400000),
        type: 'enrollment'
      },
      // Add more activities as needed
    ];

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 