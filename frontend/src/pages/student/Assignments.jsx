import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ApiService from '../../services/api';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await ApiService.getStudentAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId, submission) => {
    try {
      await ApiService.submitAssignment(assignmentId, submission);
      fetchAssignments(); // Refresh the list
    } catch (err) {
      setError('Failed to submit assignment');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>

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
                  </div>
                </div>
                <div className="flex items-center">
                  {!assignment.submitted ? (
                    <button
                      onClick={() => handleSubmitAssignment(assignment._id, {})}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  ) : (
                    <span className="text-green-500">Submitted</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {assignments.length === 0 && !error && (
          <p className="text-gray-600 text-center">No assignments available.</p>
        )}
      </div>
    </Layout>
  );
};

export default StudentAssignments; 