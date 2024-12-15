import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';
import AssignmentForm from '../../components/assignments/AssignmentForm';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentFormOpen, setIsAssignmentFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        ApiService.getTeacherCourses(),
        ApiService.getTeacherAssignments()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course Cards */}
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {course.students.length} Students
                </span>
                <button
                  onClick={() => {
                    setSelectedCourse(course._id);
                    setIsAssignmentFormOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Assignment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Assignments */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Assignments</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-gray-600">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {assignment.submissions.length} submissions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AssignmentForm
        isOpen={isAssignmentFormOpen}
        onClose={() => setIsAssignmentFormOpen(false)}
        courseId={selectedCourse}
        onAssignmentCreated={(newAssignment) => {
          setAssignments([newAssignment, ...assignments]);
          setIsAssignmentFormOpen(false);
        }}
      />
    </div>
  );
};

export default TeacherDashboard; 