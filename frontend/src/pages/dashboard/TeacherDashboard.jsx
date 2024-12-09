import { useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'
import StatsCard from '../../components/dashboard/StatsCard'
import CoursesList from '../../components/dashboard/CoursesList'
import UpcomingAssignments from '../../components/dashboard/UpcomingAssignments'
import { School, Assignment, People } from '@mui/icons-material'

const TeacherDashboard = () => {
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
          title="Assignments"
          value={stats?.assignmentsCount || 0}
          icon={<Assignment />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <CoursesList courses={stats?.courses || []} />
      </Grid>
      <Grid item xs={12} md={6}>
        <UpcomingAssignments assignments={stats?.assignments || []} />
      </Grid>
    </Grid>
  )
}

export default TeacherDashboard