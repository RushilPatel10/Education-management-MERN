import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './utils/theme';

// Components
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Helper function to redirect based on user role
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Root route redirect */}
          <Route path="/" element={<Navigate to={getRedirectPath()} />} />
          
          {/* Public route */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to={getRedirectPath()} /> : <Login />
          } />
          
          {/* Protected routes */}
          <Route element={<Layout />}>
            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
            </Route>

            {/* Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/*" element={<Navigate to="/teacher/dashboard" />} />
            </Route>

            {/* Student routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/*" element={<Navigate to="/student/dashboard" />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to={getRedirectPath()} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
