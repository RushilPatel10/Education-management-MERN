import { Box, Grid, Typography } from '@mui/material';
import CourseList from '../../components/courses/CourseList';

const StudentDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CourseList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard; 