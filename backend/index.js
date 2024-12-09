const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const corsMiddleware = require('./middleware/cors')

dotenv.config()

const app = express()

// Middleware
app.use(corsMiddleware)
app.use(express.json())

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' })
})

// Add this right after your middleware setup
app.get('/test', (req, res) => {
  console.log('Main test route hit')
  res.json({ message: 'Main server is working' })
})

// Import routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const courseRoutes = require('./routes/courseRoutes')
const assignmentRoutes = require('./routes/assignmentRoutes')
const gradeRoutes = require('./routes/gradeRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

// Register routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/grades', gradeRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Test the API:')
  console.log(`- GET http://localhost:${PORT}/api/test`)
  console.log(`- GET http://localhost:${PORT}/api/dashboard/test`)
})

module.exports = app