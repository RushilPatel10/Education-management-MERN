import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        ApiService.getEnrolledCourses(),
        ApiService.getStudentAssignments(),
        ApiService.getStudentGrades()
      ]);
      setEnrolledCourses(coursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Instructor: {course.instructor.name}
                  </span>
                  <a
                    href={`/course/${course._id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Assignments</h2>
            <div className="divide-y divide-gray-200">
              {assignments
                .filter(assignment => !assignment.submitted)
                .map((assignment) => (
                  <div key={assignment._id} className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{assignment.title}</h3>
                        <p className="text-gray-600">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={`/assignment/${assignment._id}`}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Submit
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Grades</h2>
            <div className="divide-y divide-gray-200">
              {grades.slice(0, 5).map((grade) => (
                <div key={grade._id} className="py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {grade.assignment.title}
                      </h3>
                      <p className="text-gray-600">
                        Course: {grade.course.name}
                      </p>
                    </div>
                    <div className="text-xl font-bold">
                      {grade.score}/{grade.assignment.totalPoints}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 