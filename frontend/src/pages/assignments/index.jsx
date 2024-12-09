import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton
} from '@mui/material'
import { Add, Edit, Delete, Upload } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const { user } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxScore: 100
  })

  useEffect(() => {
    fetchAssignments()
    if (user?.role === 'teacher') {
      fetchCourses()
    }
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments')
      setAssignments(response.data)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses')
      setCourses(response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedAssignment) {
        await api.put(`/assignments/${selectedAssignment._id}`, formData)
      } else {
        await api.post('/assignments', formData)
      }
      fetchAssignments()
      handleClose()
    } catch (error) {
      console.error('Error saving assignment:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/assignments/${id}`)
        fetchAssignments()
      } catch (error) {
        console.error('Error deleting assignment:', error)
      }
    }
  }

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description,
      courseId: assignment.courseId,
      dueDate: assignment.dueDate.split('T')[0],
      maxScore: assignment.maxScore
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedAssignment(null)
    setFormData({
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      maxScore: 100
    })
  }

  if (loading) return <LoadingSpinner />

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Assignments</Typography>
        {user?.role === 'teacher' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Assignment
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {assignments.map((assignment) => (
          <Grid item xs={12} md={6} key={assignment._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {assignment.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Due: ${format(new Date(assignment.dueDate), 'MMM dd, yyyy')}`}
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Max Score: ${assignment.maxScore}`}
                    color="secondary"
                  />
                </Box>
              </CardContent>
              <CardActions>
                {user?.role === 'student' ? (
                  <Button
                    startIcon={<Upload />}
                    variant="contained"
                    size="small"
                  >
                    Submit
                  </Button>
                ) : (
                  <>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(assignment)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      <Delete />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAssignment ? 'Edit Assignment' : 'Create Assignment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              select
              label="Course"
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              margin="normal"
              required
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="number"
              label="Max Score"
              value={formData.maxScore}
              onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedAssignment ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Assignments 