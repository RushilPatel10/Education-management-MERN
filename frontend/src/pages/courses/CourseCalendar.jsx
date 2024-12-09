import { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  Event
} from '@mui/icons-material'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

const CourseCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  })

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Mock events - replace with real data
  const events = [
    {
      date: new Date(2024, 1, 15),
      title: 'Assignment Due: React Basics',
      type: 'assignment'
    },
    {
      date: new Date(2024, 1, 20),
      title: 'Course Start: Advanced JavaScript',
      type: 'course'
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" sx={{ flex: 1, textAlign: 'center' }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid item xs={12/7} key={day}>
              <Typography variant="subtitle2" align="center">
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map((day) => (
            <Grid item xs={12/7} key={day.toString()}>
              <Card 
                variant="outlined"
                sx={{
                  height: 100,
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <CardContent>
                  <Typography align="right">
                    {format(day, 'd')}
                  </Typography>
                  {events
                    .filter(event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                    .map((event, index) => (
                      <Typography
                        key={index}
                        variant="caption"
                        sx={{
                          display: 'block',
                          bgcolor: event.type === 'assignment' ? 'warning.light' : 'primary.light',
                          p: 0.5,
                          borderRadius: 1,
                          mb: 0.5
                        }}
                      >
                        {event.title}
                      </Typography>
                    ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Button
        variant="contained"
        startIcon={<Event />}
        onClick={() => {/* Add event handling */}}
      >
        Add Event
      </Button>
    </Box>
  )
}

export default CourseCalendar 