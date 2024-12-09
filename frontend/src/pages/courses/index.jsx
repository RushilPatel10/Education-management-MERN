import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCourses } from '../../redux/slices/courseSlice'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, loading } = useSelector((state) => state.courses)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (loading) return <LoadingSpinner />

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {course.description}
                </Typography>
                <Chip
                  label={`${course.students?.length || 0} Students`}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={course.teacher?.name}
                  size="small"
                  color="primary"
                />
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                {user?.role === 'student' && (
                  <Button size="small" color="secondary">
                    Enroll
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Courses 