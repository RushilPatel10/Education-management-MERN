import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';
import CourseForm from '../../components/forms/CourseForm';
import UserForm from '../../components/forms/UserForm';
import DashboardStats from '../../components/dashboard/DashboardStats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesData, usersData] = await Promise.all([
        ApiService.getCourses(),
        ApiService.getUsers()
      ]);
      setCourses(coursesData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField.includes('.')) {
        const [parent, child] = sortField.split('.');
        aValue = a[parent]?.[child];
        bValue = b[parent]?.[child];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const filteredAndSortedCourses = sortData(
    courses.filter(course => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredAndSortedUsers = sortData(
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      
      <DashboardStats />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'courses'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'users'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Users
            </button>
          </div>
          
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-md"
            />
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              {activeTab === 'courses' ? 'Add Course' : 'Add User'}
            </button>
          </div>
        </div>

        {activeTab === 'courses' ? (
          <CourseTable
            courses={filteredAndSortedCourses}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onDelete={handleDeleteCourse}
          />
        ) : (
          <UserTable
            users={filteredAndSortedUsers}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            onDelete={handleDeleteUser}
          />
        )}
      </div>

      {isFormOpen && (
        activeTab === 'courses' ? (
          <CourseForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleCourseSubmit}
          />
        ) : (
          <UserForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleUserSubmit}
          />
        )
      )}
    </div>
  );
};

export default AdminDashboard; 