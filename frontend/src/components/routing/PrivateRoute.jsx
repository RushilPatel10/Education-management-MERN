import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user's role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" />;
      case 'teacher':
        return <Navigate to="/teacher/dashboard" />;
      case 'student':
        return <Navigate to="/student/dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

export default PrivateRoute; 