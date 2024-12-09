import { useEffect } from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AdminDashboard from './AdminDashboard'
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) return <LoadingSpinner />

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'teacher':
        return <TeacherDashboard />
      case 'student':
        return <StudentDashboard />
      default:
        return null
    }
  }

  return (
    <>
      <PageHeader 
        title="Dashboard" 
        breadcrumbs={[{ text: 'Dashboard' }]} 
      />
      {renderDashboard()}
    </>
  )
}

export default Dashboard 