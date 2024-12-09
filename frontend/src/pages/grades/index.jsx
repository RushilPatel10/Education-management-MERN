import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const Grades = () => {
  const [grades, setGrades] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    score: '',
    feedback: ''
  })

  useEffect(() => {
    fetchGrades()
    if (user?.role === 'teacher') {
      fetchCourses()
    }
  }, [])

  const fetchGrades = async () => {
    try {
      const response = await api.get('/grades')
      setGrades(response.data)
    } catch (error) {
      console.error('Error fetching grades:', error)
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

  const handleGradeSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/grades/${selectedGrade._id}`, formData)
      fetchGrades()
      handleClose()
    } catch (error) {
      console.error('Error updating grade:', error)
    }
  }

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade)
    setFormData({
      score: grade.score,
      feedback: grade.feedback || ''
    })
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
    setSelectedGrade(null)
    setFormData({
      score: '',
      feedback: ''
    })
  }

  const getGradeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'success.main'
    if (percentage >= 80) return 'info.main'
    if (percentage >= 70) return 'warning.main'
    return 'error.main'
  }

  if (loading) return <LoadingSpinner />

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grades
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Grades" />
          <Tab label="By Course" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Assignment</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Progress</TableCell>
                {user?.role === 'student' && <TableCell>Feedback</TableCell>}
                {user?.role === 'teacher' && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade._id}>
                  <TableCell>{grade.course.name}</TableCell>
                  <TableCell>{grade.assignment.title}</TableCell>
                  <TableCell>
                    {grade.score}/{grade.assignment.maxScore}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(grade.score / grade.assignment.maxScore) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: getGradeColor(grade.score, grade.assignment.maxScore)
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round((grade.score / grade.assignment.maxScore) * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {user?.role === 'student' && (
                    <TableCell>{grade.feedback || 'No feedback yet'}</TableCell>
                  )}
                  {user?.role === 'teacher' && (
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleEditGrade(grade)}
                      >
                        Update Grade
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Grade</DialogTitle>
        <form onSubmit={handleGradeSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              type="number"
              label="Score"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              margin="normal"
              required
              inputProps={{
                min: 0,
                max: selectedGrade?.assignment?.maxScore
              }}
            />
            <TextField
              fullWidth
              label="Feedback"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Grades 