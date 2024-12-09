const mongoose = require('mongoose')

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  feedback: String
}, {
  timestamps: true
})

module.exports = mongoose.model('Grade', gradeSchema) 