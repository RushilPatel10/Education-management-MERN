import React from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardStats = ({ stats }) => {
  const { user } = useAuth();

  const renderAdminStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Total Students" value={stats.totalStudents} />
      <StatCard title="Total Teachers" value={stats.totalTeachers} />
      <StatCard title="Total Courses" value={stats.totalCourses} />
      <StatCard title="Total Enrollments" value={stats.totalEnrollments} />
    </div>
  );

  const renderTeacherStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard title="Active Courses" value={stats.totalCourses} />
      <StatCard title="Total Students" value={stats.totalStudents} />
      <StatCard title="Pending Assignments" value={stats.pendingAssignments} />
    </div>
  );

  const renderStudentStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Enrolled Courses" value={stats.totalCourses} />
      <StatCard title="Total Assignments" value={stats.totalAssignments} />
      <StatCard title="Completed" value={stats.completedAssignments} />
      <StatCard title="Pending" value={stats.pendingAssignments} />
    </div>
  );

  const StatCard = ({ title, value }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value || 0}</p>
    </div>
  );

  return (
    <div className="mb-8">
      {user?.role === 'admin' && renderAdminStats()}
      {user?.role === 'teacher' && renderTeacherStats()}
      {user?.role === 'student' && renderStudentStats()}
    </div>
  );
};

export default DashboardStats; 