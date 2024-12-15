const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

router.get('/stats', auth, async (req, res) => {
  try {
    let query = {};
    
    // Role-based stats
    if (req.user.role === 'teacher') {
      query.instructor = req.user._id;
    } else if (req.user.role === 'student') {
      query.students = req.user._id;
    }

    const totalCourses = await Course.countDocuments(query);
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAssignments = await Assignment.countDocuments();
    
    // Calculate completion rate
    const completedAssignments = await Assignment.countDocuments({ 
      'submissions.grade': { $exists: true } 
    });
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
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
});

router.get('/activities', auth, async (req, res) => {
  try {
    let query = {};
    
    // Role-based activities
    if (req.user.role === 'teacher') {
      query.instructor = req.user._id;
    } else if (req.user.role === 'student') {
      query.students = req.user._id;
    }

    const recentCourses = await Course.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('instructor', 'name');

    const recentAssignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('course', 'name');

    const activities = [
      ...recentCourses.map(course => ({
        type: 'course',
        description: `Course "${course.name}" ${course.createdAt ? 'created' : 'updated'}`,
        timestamp: course.createdAt || new Date(),
        data: course
      })),
      ...recentAssignments.map(assignment => ({
        type: 'assignment',
        description: `Assignment "${assignment.title}" added to ${assignment.course.name}`,
        timestamp: assignment.createdAt,
        data: assignment
      }))
    ].sort((a, b) => b.timestamp - a.timestamp)
     .slice(0, 10);

    res.json(activities);
  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

module.exports = router; 