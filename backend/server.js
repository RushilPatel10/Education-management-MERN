const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Basic middleware
app.use(cors())
app.use(express.json())

// Basic test route
app.get('/', (req, res) => {
  console.log('Root route accessed')
  res.json({ message: 'Server is running' })
})

app.get('/api/test', (req, res) => {
  console.log('Test route accessed')
  res.json({ message: 'API is working' })
})

// Dashboard routes
const dashboardRoutes = require('./routes/dashboardRoutes')
app.use('/api/dashboard', dashboardRoutes)

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ message: 'Server error' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log('Available routes:')
  console.log('- GET /')
  console.log('- GET /api/test')
  console.log('- GET /api/dashboard/test')
}) 