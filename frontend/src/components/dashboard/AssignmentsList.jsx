import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import { Assignment, CheckCircle, Warning } from '@mui/icons-material'
import { format } from 'date-fns'

const AssignmentsList = ({ assignments }) => {
  const getStatusColor = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    if (now > due) return 'error'
    if (now.getTime() + 86400000 > due.getTime()) return 'warning'
    return 'success'
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Assignments
      </Typography>
      <List>
        {assignments.map((assignment) => (
          <ListItem key={assignment.id} divider>
            <ListItemText
              primary={assignment.title}
              secondary={`Due: ${format(new Date(assignment.dueDate), 'MMM dd, yyyy')}`}
            />
            <ListItemSecondaryAction>
              <Chip
                label={format(new Date(assignment.dueDate), 'MMM dd')}
                color={getStatusColor(assignment.dueDate)}
                size="small"
                sx={{ mr: 1 }}
              />
              {assignment.submitted ? (
                <Tooltip title="Submitted">
                  <IconButton size="small" color="success">
                    <CheckCircle />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Not Submitted">
                  <IconButton size="small" color="warning">
                    <Assignment />
                  </IconButton>
                </Tooltip>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {assignments.length === 0 && (
          <ListItem>
            <ListItemText primary="No upcoming assignments" />
          </ListItem>
        )}
      </List>
    </Paper>
  )
}

export default AssignmentsList 