import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Chip
} from '@mui/material'
import {
  Person,
  Assignment,
  Book,
  Grade,
  Schedule
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const CourseDetails = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    fetchCourseDetails()
  }, [id])

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`)
      setCourse(response.data)
    } catch (error) {
      console.error('Error fetching course details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!course) return <Typography>Course not found</Typography>

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {course.name}
            </Typography>
            <Typography color="textSecondary" paragraph>
              {course.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<Person />}
                label={`Instructor: ${course.teacher.name}`}
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<Schedule />}
                label={`Duration: ${course.duration}`}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            {user?.role === 'student' && (
              <Button
                variant="contained"
                color="primary"
                size="large"
              >
                Enroll Now
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Content" />
          <Tab label="Assignments" />
          <Tab label="Students" />
          <Tab label="Grades" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <List>
              {course.modules?.map((module, index) => (
                <div key={module.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Book />
                    </ListItemIcon>
                    <ListItemText
                      primary={module.title}
                      secondary={module.description}
                    />
                  </ListItem>
                  {index < course.modules.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}

          {tabValue === 1 && (
            <List>
              {course.assignments?.map((assignment, index) => (
                <div key={assignment.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < course.assignments.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}

          {/* Add content for other tabs */}
        </Box>
      </Paper>
    </Box>
  )
}

export default CourseDetails 