import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ApiService from '../../services/api';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        ApiService.getTeacherAssignments(),
        ApiService.getTeacherCourses()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      await ApiService.createAssignment(assignmentData);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      setError('Failed to create assignment');
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Assignment
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {assignments.map((assignment) => (
            <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Course: {assignment.course?.name}</p>
                    <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    <p>Submissions: {assignment.submissions?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {/* Handle edit */}}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {/* Handle view submissions */}}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    View Submissions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && !error && (
          <p className="text-gray-600 text-center">No assignments created yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default TeacherAssignments; 