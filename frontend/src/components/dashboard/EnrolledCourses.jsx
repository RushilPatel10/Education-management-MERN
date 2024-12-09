import { Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const EnrolledCourses = ({ courses }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Enrolled Courses
      </Typography>
      <List>
        {courses.map((course, index) => (
          <div key={course.id}>
            <ListItem>
              <ListItemText
                primary={course.name}
                secondary={`Teacher: ${course.teacher.name}`}
              />
            </ListItem>
            {index < courses.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  )
}

export default EnrolledCourses 