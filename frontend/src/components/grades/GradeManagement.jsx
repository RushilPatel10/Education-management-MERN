import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const GradeManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment);
    }
  }, [selectedAssignment]);

  const fetchAssignments = async () => {
    try {
      const data = await ApiService.getTeacherAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const data = await ApiService.getAssignmentSubmissions(assignmentId);
      setSubmissions(data);
    } catch (err) {
      setError('Failed to fetch submissions');
    }
  };

  const handleGradeSubmit = async (submissionId, score, feedback) => {
    try {
      await ApiService.gradeSubmission(selectedAssignment, submissionId, {
        score,
        feedback
      });
      setSuccess('Grade submitted successfully');
      fetchSubmissions(selectedAssignment);
    } catch (err) {
      setError('Failed to submit grade');
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
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Assignment
        </label>
        <select
          value={selectedAssignment || ''}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Choose an assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment._id} value={assignment._id}>
              {assignment.title}
            </option>
          ))}
        </select>
      </div>

      {selectedAssignment && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <li key={submission._id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">
                        {submission.student.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {submission.files.map((file, index) => (
                      <a
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Submission {index + 1}
                      </a>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      handleGradeSubmit(
                        submission._id,
                        formData.get('score'),
                        formData.get('feedback')
                      );
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Score
                      </label>
                      <input
                        type="number"
                        name="score"
                        defaultValue={submission.grade?.score}
                        min="0"
                        max="100"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Feedback
                      </label>
                      <textarea
                        name="feedback"
                        defaultValue={submission.grade?.feedback}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Submit Grade
                      </button>
                    </div>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GradeManagement; 