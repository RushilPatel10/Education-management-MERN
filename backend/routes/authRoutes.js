const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'student'
    })

    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' })
  }
})

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' })
  }
})

module.exports = router 