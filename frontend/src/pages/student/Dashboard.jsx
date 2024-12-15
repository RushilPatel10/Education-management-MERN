import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';
import Layout from '../../components/layout/Layout';
import DashboardStats from '../../components/dashboard/DashboardStats';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    courses: [],
    assignments: [],
    stats: {
      totalCourses: 0,
      totalAssignments: 0,
      completedAssignments: 0,
      pendingAssignments: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        ApiService.getEnrolledCourses(),
        ApiService.getStudentAssignments()
      ]);

      // Calculate stats
      const completedAssignments = assignmentsData.filter(a => a.submitted).length;
      
      setData({
        courses: coursesData,
        assignments: assignmentsData,
        stats: {
          totalCourses: coursesData.length,
          totalAssignments: assignmentsData.length,
          completedAssignments,
          pendingAssignments: assignmentsData.length - completedAssignments
        }
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome, {user?.name}!
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <DashboardStats stats={data.stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">My Courses</h2>
            {data.courses.length > 0 ? (
              <ul className="space-y-4">
                {data.courses.map((course) => (
                  <li key={course._id} className="border-b pb-2">
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Instructor: {course.instructor.name}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No courses enrolled yet.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
            {data.assignments.length > 0 ? (
              <ul className="space-y-4">
                {data.assignments.map((assignment) => (
                  <li key={assignment._id} className="border-b pb-2">
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Status: {assignment.submitted ? 'Submitted' : 'Pending'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No assignments due.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard; 