import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  School,
  Person,
  Schedule,
  Book
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const ManageCourses = () => {
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: '',
    duration: '',
    maxStudents: 30,
    startDate: '',
    endDate: '',
    isActive: true,
    prerequisites: '',
    category: 'general'
  })

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses')
      setCourses(response.data)
    } catch (error) {
      showSnackbar('Error fetching courses', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/users?role=teacher')
      setTeachers(response.data)
    } catch (error) {
      showSnackbar('Error fetching teachers', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedCourse) {
        await api.put(`/courses/${selectedCourse._id}`, formData)
        showSnackbar('Course updated successfully')
      } else {
        await api.post('/courses', formData)
        showSnackbar('Course created successfully')
      }
      fetchCourses()
      handleClose()
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error saving course', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`)
        showSnackbar('Course deleted successfully')
        fetchCourses()
      } catch (error) {
        showSnackbar('Error deleting course', 'error')
      }
    }
  }

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setFormData({
      name: course.name,
      description: course.description,
      teacherId: course.teacherId,
      duration: course.duration,
      maxStudents: course.maxStudents,
      startDate: course.startDate?.split('T')[0] || '',
      endDate: course.endDate?.split('T')[0] || '',
      isActive: course.isActive,
      prerequisites: course.prerequisites || '',
      category: course.category || 'general'
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedCourse(null)
    setFormData({
      name: '',
      description: '',
      teacherId: '',
      duration: '',
      maxStudents: 30,
      startDate: '',
      endDate: '',
      isActive: true,
      prerequisites: '',
      category: 'general'
    })
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  if (loading) return <LoadingSpinner />

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Courses</Typography>
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedCourse(null)
              setFormData({
                name: '',
                description: '',
                teacherId: '',
                duration: '',
                maxStudents: 30,
                startDate: '',
                endDate: '',
                isActive: true,
                prerequisites: '',
                category: 'general'
              })
              setOpenDialog(true)
            }}
          >
            Create Course
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.name}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {course.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<Person />}
                    label={`Teacher: ${course.teacher?.name || 'Unassigned'}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<Schedule />}
                    label={`Duration: ${course.duration}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    icon={<School />}
                    label={`Students: ${course.students?.length || 0}/${course.maxStudents}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={course.isActive ? 'Active' : 'Inactive'}
                    color={course.isActive ? 'success' : 'default'}
                    sx={{ mb: 1 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(course)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(course._id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCourse ? 'Edit Course' : 'Create Course'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Teacher"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  required
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 12 weeks"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Maximum Students"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="mathematics">Mathematics</MenuItem>
                  <MenuItem value="science">Science</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  multiline
                  rows={2}
                  placeholder="Enter course prerequisites"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ManageCourses 