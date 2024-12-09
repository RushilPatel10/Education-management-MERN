const User = require('../models/User');
const Course = require('../models/Course');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('courses', 'name description');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('courses', 'name description');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow admins to view other users, or users to view their own profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    
    // Prevent password update through this route
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You might want to handle cleanup here (e.g., removing user from courses)
    await Course.updateMany(
      { students: req.params.id },
      { $pull: { students: req.params.id } }
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Additional user-related controllers
exports.enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    if (user.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to user's courses
    user.courses.push(courseId);
    await user.save();

    // Add user to course's students
    course.students.push(userId);
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove course from user's courses
    user.courses = user.courses.filter(id => id.toString() !== courseId);
    await user.save();

    // Remove user from course's students
    course.students = course.students.filter(id => id.toString() !== userId);
    await course.save();

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 