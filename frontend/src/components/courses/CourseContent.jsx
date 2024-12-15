import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../../services/api';

const CourseContent = () => {
  const { courseId } = useParams();
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'lecture',
    files: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchContent();
  }, [courseId]);

  const fetchContent = async () => {
    try {
      const data = await ApiService.getCourseContent(courseId);
      setContent(data);
    } catch (err) {
      setError('Failed to fetch course content');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', newContent.title);
      formData.append('description', newContent.description);
      formData.append('type', newContent.type);
      
      Array.from(newContent.files).forEach(file => {
        formData.append('files', file);
      });

      await ApiService.addCourseContent(courseId, formData);
      setSuccess('Content added successfully');
      fetchContent();
      setNewContent({
        title: '',
        description: '',
        type: 'lecture',
        files: []
      });
    } catch (err) {
      setError(err.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await ApiService.deleteCourseContent(courseId, contentId);
        setSuccess('Content deleted successfully');
        fetchContent();
      } catch (err) {
        setError('Failed to delete content');
      }
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Content</h2>
        <form onSubmit={handleContentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newContent.description}
              onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              value={newContent.type}
              onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="lecture">Lecture</option>
              <option value="resource">Resource</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Files
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setNewContent({ ...newContent, files: e.target.files })}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Course Content</h2>
        {content.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-gray-700">{item.description}</p>
              {item.files && item.files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Attachments:</h4>
                  <ul className="mt-2 space-y-2">
                    {item.files.map((file, index) => (
                      <li key={index}>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseContent; 