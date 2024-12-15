import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import StudentDashboard from '../pages/student/Dashboard';
import TeacherDashboard from '../pages/teacher/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import StudentCourses from '../pages/student/Courses';
import TeacherCourses from '../pages/teacher/Courses';
import StudentAssignments from '../pages/student/Assignments';
import TeacherAssignments from '../pages/teacher/Assignments';
import StudentGrades from '../pages/student/Grades';
import TeacherGrades from '../pages/teacher/Grades';
import AdminUsers from '../pages/admin/Users';
import AdminCourses from '../pages/admin/Courses';
import PrivateRoute from '../components/routing/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <PrivateRoute role="student">
            <StudentCourses />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <PrivateRoute role="student">
            <StudentAssignments />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/grades"
        element={
          <PrivateRoute role="student">
            <StudentGrades />
          </PrivateRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <PrivateRoute role="teacher">
            <TeacherDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/courses"
        element={
          <PrivateRoute role="teacher">
            <TeacherCourses />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <PrivateRoute role="teacher">
            <TeacherAssignments />
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/grades"
        element={
          <PrivateRoute role="teacher">
            <TeacherGrades />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <PrivateRoute role="admin">
            <AdminCourses />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute role="admin">
            <AdminUsers />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes; 