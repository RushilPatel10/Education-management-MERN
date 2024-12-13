const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      courseId: req.params.courseId
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId })
      .populate('submissions.student', 'name email');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    assignment.submissions.push({
      student: req.user.id,
      fileUrl: req.body.fileUrl
    });
    
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.gradeAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    const submission = assignment.submissions.id(req.params.submissionId);
    
    submission.grade = req.body.grade;
    submission.feedback = req.body.feedback;
    
    await assignment.save();
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 