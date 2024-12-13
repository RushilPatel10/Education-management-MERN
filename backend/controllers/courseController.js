const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      teacher: req.body.teacherId
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    let courses;
    switch (req.user.role) {
      case 'admin':
        courses = await Course.find()
          .populate('teacher', 'name email')
          .populate('students', 'name email');
        break;
      case 'teacher':
        courses = await Course.find({ teacher: req.user.id })
          .populate('students', 'name email');
        break;
      case 'student':
        courses = await Course.find({ students: req.user.id })
          .populate('teacher', 'name email');
        break;
    }
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enrollStudent = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: req.body.studentId } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 