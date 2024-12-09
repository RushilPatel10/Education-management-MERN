import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard'
import Profile from '../pages/profile'
import Courses from '../pages/courses'
import Students from '../pages/students'
import Teachers from '../pages/teachers'

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      </Route>

      {/* Protected Routes */}
      <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<Courses />} />
        {user?.role === 'admin' && (
          <>
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
          </>
        )}
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes 