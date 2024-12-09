import { useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsCard from '../../components/dashboard/StatsCard'
import RecentActivities from '../../components/dashboard/RecentActivities'
import EnrollmentChart from '../../components/dashboard/EnrollmentChart'
import { School, People, Person } from '@mui/icons-material'

const AdminDashboard = () => {
  const { stats } = useSelector((state) => state.dashboard)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Total Courses"
          value={stats?.coursesCount || 0}
          icon={<School />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Total Students"
          value={stats?.studentsCount || 0}
          icon={<People />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Total Teachers"
          value={stats?.teachersCount || 0}
          icon={<Person />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <EnrollmentChart data={stats?.enrollmentTrend || []} />
      </Grid>
      <Grid item xs={12} md={4}>
        <RecentActivities activities={stats?.recentActivities || []} />
      </Grid>
    </Grid>
  )
}

export default AdminDashboard 