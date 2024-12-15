const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, isTeacher } = require('../middleware/auth');

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific course
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('students', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a course (teachers only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.id
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a course (teachers only)
router.put('/:id', auth, isTeacher, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a course (teachers only)
router.delete('/:id', auth, isTeacher, async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user.id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a course (students only)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.students.push(req.user.id);
    await course.save();
    
    res.json({ message: 'Successfully enrolled in course' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Unenroll from a course (students only)
router.post('/:id/unenroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentIndex = course.students.indexOf(req.user.id);
    if (studentIndex === -1) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    course.students.splice(studentIndex, 1);
    await course.save();
    
    res.json({ message: 'Successfully unenrolled from course' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 