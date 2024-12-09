import { useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsCard from '../../components/dashboard/StatsCard'
import EnrolledCourses from '../../components/dashboard/EnrolledCourses'
import AssignmentsList from '../../components/dashboard/AssignmentsList'
import GradesOverview from '../../components/dashboard/GradesOverview'
import { School, Assignment, Grade } from '@mui/icons-material'

const StudentDashboard = () => {
  const { stats } = useSelector((state) => state.dashboard)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Enrolled Courses"
          value={stats?.enrolledCoursesCount || 0}
          icon={<School />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Pending Assignments"
          value={stats?.pendingAssignmentsCount || 0}
          icon={<Assignment />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <StatsCard
          title="Average Grade"
          value={stats?.averageGrade || 'N/A'}
          icon={<Grade />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <EnrolledCourses courses={stats?.enrolledCourses || []} />
      </Grid>
      <Grid item xs={12} md={6}>
        <AssignmentsList assignments={stats?.assignments || []} />
      </Grid>
      <Grid item xs={12}>
        <GradesOverview grades={stats?.grades || []} />
      </Grid>
    </Grid>
  )
}

export default StudentDashboard 