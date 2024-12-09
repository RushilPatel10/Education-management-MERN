import { Paper, Typography, List, ListItem, ListItemText, Divider } from '@mui/material'

const CoursesList = ({ courses }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        My Courses
      </Typography>
      <List>
        {courses.map((course, index) => (
          <div key={course.id}>
            <ListItem>
              <ListItemText
                primary={course.name}
                secondary={`Students: ${course.studentsCount}`}
              />
            </ListItem>
            {index < courses.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  )
}

export default CoursesList 