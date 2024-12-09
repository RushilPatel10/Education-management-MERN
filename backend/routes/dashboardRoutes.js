const express = require('express')
const router = express.Router()

console.log('Dashboard routes loading...')

// Debug middleware for all dashboard routes
router.use((req, res, next) => {
  console.log('Dashboard route accessed:', {
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl
  })
  next()
})

// Test route with detailed logging
router.get('/test', (req, res) => {
  console.log('Dashboard test route hit')
  res.json({
    message: 'Dashboard test route working',
    route: '/test',
    fullPath: req.originalUrl
  })
})

// Another test route
router.get('/', (req, res) => {
  console.log('Dashboard root route hit')
  res.json({
    message: 'Dashboard root route working',
    availableRoutes: ['/test', '/stats']
  })
})

console.log('Dashboard routes loaded')

module.exports = router