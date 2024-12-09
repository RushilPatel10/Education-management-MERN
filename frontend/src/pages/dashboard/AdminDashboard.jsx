import { Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import {
  PeopleAlt,
  School,
  Class,
  TrendingUp
} from '@mui/icons-material'
import StatsCard from '../../components/dashboard/StatsCard'
import RecentActivities from '../../components/dashboard/RecentActivities'
import EnrollmentChart from '../../components/dashboard/EnrollmentChart'

const AdminDashboard = () => {
  const { stats } = useSelector((state) => state.dashboard)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<PeopleAlt />}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={<School />}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Active Courses"
          value={stats?.activeCourses || 0}
          icon={<Class />}
          color="#ed6c02"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={<TrendingUp />}
          color="#9c27b0"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Enrollment Trends
          </Typography>
          <EnrollmentChart data={stats?.enrollmentTrends || []} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <RecentActivities activities={stats?.recentActivities || []} />
      </Grid>
    </Grid>
  )
}

export default AdminDashboard 