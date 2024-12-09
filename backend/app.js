const express = require('express')
const app = express()
const dashboardRoutes = require('./routes/dashboardRoutes')

// ... other middleware ...
app.use('/api/dashboard', dashboardRoutes) 