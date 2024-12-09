import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsCard from '../../components/dashboard/StatsCard'
import EnrolledCourses from '../../components/dashboard/EnrolledCourses'
import AssignmentsList from '../../components/dashboard/AssignmentsList'
import GradesOverview from '../../components/dashboard/GradesOverview'

const StudentDashboard = () => {
  const { studentStats } = useSelector((state) => state.dashboard)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="Enrolled Courses"
          value={studentStats?.enrolledCourses || 0}
          color="#1976d2"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="Completed Assignments"
          value={studentStats?.completedAssignments || 0}
          color="#2e7d32"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatsCard
          title="Average Grade"
          value={studentStats?.averageGrade || 'N/A'}
          color="#ed6c02"
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <EnrolledCourses courses={studentStats?.courses || []} />
      </Grid>

      <Grid item xs={12} md={4}>
        <AssignmentsList assignments={studentStats?.pendingAssignments || []} />
      </Grid>

      <Grid item xs={12}>
        <GradesOverview grades={studentStats?.grades || []} />
      </Grid>
    </Grid>
  )
}

export default StudentDashboard 