import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../redux/slices/dashboardSlice'
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats, loading, error } = useSelector((state) => state.dashboard)

  useEffect(() => {
    console.log('Dashboard mounted, fetching stats...')
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Courses</Typography>
            <Typography variant="h4">{stats.coursesCount}</Typography>
          </Paper>
        </Grid>
        {/* Add more stats display here */}
      </Grid>
    </Box>
  )
}

export default Dashboard 