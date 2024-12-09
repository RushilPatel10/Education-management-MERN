const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Course = require('../models/Course')

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'name email')
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' })
  }
})

// Create new course (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create courses' })
    }

    const course = new Course({
      ...req.body,
      teacher: req.body.teacherId
    })

    await course.save()
    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error creating course' })
  }
})

// Update course (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update courses' })
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, teacher: req.body.teacherId },
      { new: true }
    )
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error updating course' })
  }
})

// Delete course (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can delete courses' })
    }

    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    res.json({ message: 'Course deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course' })
  }
})

// Get single course
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email')
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' })
  }
})

module.exports = router 