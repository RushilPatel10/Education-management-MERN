import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box
} from '@mui/material';
import ApiService from '../../services/api';

const CourseList = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await ApiService.getCourses();
        setCourses(data);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await ApiService.enrollCourse(courseId);
      // Refresh courses after enrollment
      const updatedCourses = await ApiService.getCourses();
      setCourses(updatedCourses);
    } catch (err) {
      setError('Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {course.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {course.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Instructor: {course.instructor.name}
              </Typography>
              {user?.role === 'student' && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleEnroll(course._id)}
                >
                  Enroll
                </Button>
              )}
              {user?.role === 'teacher' && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleManageCourse(course._id)}
                >
                  Manage Course
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
      
      {/* Add Course Button for Teachers and Admins */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }}
          >
            <CardContent>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAddCourse()}
                startIcon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Add New Course
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default CourseList; 