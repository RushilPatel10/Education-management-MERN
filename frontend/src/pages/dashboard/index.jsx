import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AdminDashboard from './AdminDashboard'
import TeacherDashboard from './TeacherDashboard'
import StudentDashboard from './StudentDashboard'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) return <LoadingSpinner />

  switch (user?.role) {
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

export default Dashboard 