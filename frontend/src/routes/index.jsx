import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Dashboard Pages
import Dashboard from '../pages/dashboard'
import Courses from '../pages/courses'
import Profile from '../pages/profile'
import Students from '../pages/students'
import Teachers from '../pages/teachers'

export const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/*" element={<Courses />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin Only Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
          </>
        )}
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
} 