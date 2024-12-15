const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  content: [{
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['lecture', 'assignment', 'resource']
    },
    files: [{
      filename: String,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ students: 1 });

module.exports = mongoose.model('Course', courseSchema); 