import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  LinearProgress,
  Tooltip
} from '@mui/material'

const GradesOverview = ({ grades }) => {
  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'success.main'
    if (percentage >= 80) return 'info.main'
    if (percentage >= 70) return 'warning.main'
    return 'error.main'
  }

  const calculateGradePercentage = (score, maxScore) => {
    return (score / maxScore) * 100
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Grades Overview
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Assignment</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((grade) => {
              const percentage = calculateGradePercentage(grade.score, grade.maxScore)
              return (
                <TableRow key={grade.id}>
                  <TableCell>{grade.courseName}</TableCell>
                  <TableCell>{grade.assignmentTitle}</TableCell>
                  <TableCell align="right">
                    {grade.score}/{grade.maxScore}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${percentage.toFixed(1)}%`}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percentage}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getGradeColor(percentage)
                            }
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
            {grades.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No grades available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default GradesOverview 