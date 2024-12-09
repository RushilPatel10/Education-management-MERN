const corsMiddleware = (req, res, next) => {
  // Always set the CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400') // 24 hours

  // Log CORS headers for debugging
  console.log('CORS Headers set:', {
    origin: res.getHeader('Access-Control-Allow-Origin'),
    methods: res.getHeader('Access-Control-Allow-Methods'),
    credentials: res.getHeader('Access-Control-Allow-Credentials')
  })

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    res.status(204).end()
    return
  }

  next()
}

module.exports = corsMiddleware 