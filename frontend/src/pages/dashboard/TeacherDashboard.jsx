import { Grid, Paper, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsCard from '../../components/dashboard/StatsCard'
import CoursesList from '../../components/dashboard/CoursesList'
import UpcomingAssignments from '../../components/dashboard/UpcomingAssignments'

const TeacherDashboard = () => {
  const { teacherStats } = useSelector((state) => state.dashboard)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="My Courses"
          value={teacherStats?.totalCourses || 0}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="Total Students"
          value={teacherStats?.totalStudents || 0}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="Pending Assignments"
          value={teacherStats?.pendingAssignments || 0}
          color="#ed6c02"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <CoursesList courses={teacherStats?.courses || []} />
      </Grid>

      <Grid item xs={12} md={4}>
        <UpcomingAssignments assignments={teacherStats?.upcomingAssignments || []} />
      </Grid>
    </Grid>
  )
}

export default TeacherDashboard 